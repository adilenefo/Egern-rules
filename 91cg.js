WidgetMetadata = {
    id: "91CG",
    title: "91瓜叔",
    version: "1.0.5",
    requiredVersion: "0.0.1",
    description: "91瓜叔 - 在线吃瓜",
    author: "Forward",
    site: "https://91cg1.com",
    detailCacheDuration: 1200,
    modules: [
        {
            id: "latestVideos",
            title: "🆕 最新发布",
            functionName: "getLatestVideos",
            cacheDuration: 300,
            params: [
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "categoryBrowse",
            title: "📂 分类浏览",
            functionName: "getCategoryVideos",
            cacheDuration: 300,
            params: [
                {
                    name: "category",
                    title: "选择分类",
                    type: "enumeration",
                    value: "zxcghl",
                    enumOptions: [
                        { title: "今日吃瓜", value: "zxcghl" },
                        { title: "最高点击", value: "rsdg" },
                        { title: "必吃大瓜", value: "bcdg" },
                        { title: "师生专栏", value: "xsjlb" },
                        { title: "深夜撸片", value: "lpsd" },
                        { title: "海角乱伦", value: "hjll" },
                        { title: "每日大赛", value: "mrds" },
                        { title: "网红黑料", value: "whhl" },
                        { title: "成人动漫", value: "crdm" },
                        { title: "明星黑料", value: "mxhl" },
                        { title: "自拍偷拍", value: "zptp" },
                        { title: "91探花", value: "91th" },
                        { title: "猎奇重口", value: "lqzk" },
                        { title: "明星AI", value: "aikj" },
                        { title: "社会奇闻", value: "qwys" },
                        { title: "反差靓女", value: "fclv" },
                        { title: "擦边短剧", value: "dydj" },
                        { title: "网黄合集", value: "gcwh" }
                    ]
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        }
    ]
};

const BASE_URL = "https://91cg1.com";
const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
};

function trimUrl(url) {
    return url ? url.replace(/\r?\n|\r/g, "").trim() : "";
}

function ensureAbsoluteUrl(url) {
    if (!url) return "";
    url = trimUrl(url);
    if (url.startsWith("//")) return "https:" + url;
    if (url.startsWith("/")) return BASE_URL + url;
    if (!url.startsWith("http")) return BASE_URL + "/" + url;
    return url;
}

function parseVideoList(html) {
    const $ = Widget.html.load(html);
    const result = [];
    
    const coverMap = {};
    const scriptRegex = /loadBannerDirect\s*\(\s*'([^']+)'\s*,\s*'[^']*'\s*,\s*document\.querySelector\s*\(\s*'#post-card-(\d+)'\s*\)/g;
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(html)) !== null) {
        if (scriptMatch[1] && scriptMatch[2]) {
            coverMap[scriptMatch[2]] = scriptMatch[1];
        }
    }
    
    $("article[itemscope]").each(function() {
        const $article = $(this);
        const linkEl = $article.find("a[href*='/archives/']").first();
        let link = linkEl.attr("href") || "";
        const idMatch = link.match(/\/archives\/(\d+)/);
        
        if (!idMatch) return;
        
        const videoId = idMatch[1];
        link = ensureAbsoluteUrl(link);
        
        const title = $article.find("h2").text().trim() ||
                      $article.find(".post-card-title").text().trim() ||
                      linkEl.attr("title") ||
                      "未知标题";
        
        let coverUrl = "";
        if (coverMap[videoId]) {
            coverUrl = coverMap[videoId];
        }
        if (!coverUrl) {
            const img = $article.find("img").first();
            if (img.length) {
                coverUrl = img.attr("data-xkrkllgl") || 
                          img.attr("data-src") || 
                          img.attr("src") || "";
                if (coverUrl.startsWith("data:")) coverUrl = "";
            }
        }
        
        const tags = $article.find(".wraps").text().trim();
        
        result.push({
            id: videoId,
            type: "link",
            mediaType: "movie",
            title: title,
            coverUrl: coverUrl,
            link: link,
            description: tags || ""
        });
    });
    
    return result;
}

function extractCoverFromDetail(html) {
    const $ = Widget.html.load(html);
    
    const imgWithData = $('img[data-xkrkllgl]').first();
    if (imgWithData.length) {
        const coverUrl = imgWithData.attr('data-xkrkllgl');
        if (coverUrl) return coverUrl;
    }
    
    let coverUrl = $('meta[property="og:image"]').attr('content') || "";
    if (coverUrl) return coverUrl;
    
    const contentImg = $(".post-content img, article img").first();
    if (contentImg.length) {
        coverUrl = contentImg.attr('data-xkrkllgl') || contentImg.attr('src') || "";
        if (coverUrl && !coverUrl.startsWith('data:')) return coverUrl;
    }
    
    return "";
}

function extractVideoUrl(html) {
    let match = html.match(/data-config\s*=\s*'(\{[^']+\})'/i);
    if (match && match[1]) {
        try {
            const config = JSON.parse(match[1].replace(/\\\//g, '/'));
            if (config.video && config.video.url) {
                return { videoUrl: config.video.url.replace(/\\\//g, '/'), type: "hls" };
            }
        } catch (e) {}
    }
    
    match = html.match(/"url"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
    if (match && match[1]) {
        return { videoUrl: match[1].replace(/\\\//g, '/'), type: "hls" };
    }
    
    match = html.match(/https?:\/\/hls\.[^"'\s<>\\]+\.m3u8[^"'\s<>\\]*/i);
    if (match) {
        return { videoUrl: match[0].replace(/\\\//g, '/'), type: "hls" };
    }
    
    return null;
}

async function getLatestVideos(params = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    let url = page > 1 ? `${BASE_URL}/page/${page}/` : BASE_URL;
    
    const response = await Widget.http.get(url, { headers: HEADERS });
    if (!response || !response.data) throw new Error("页面加载失败");
    
    return parseVideoList(response.data);
}

async function getCategoryVideos(params = {}) {
    const category = params.category || "zxcghl";
    const page = Math.max(1, Number(params.page) || 1);
    let url = `${BASE_URL}/category/${category}/`;
    if (page > 1) url = `${BASE_URL}/category/${category}/page/${page}/`;
    
    const response = await Widget.http.get(url, { headers: HEADERS });
    if (!response || !response.data) throw new Error("页面加载失败");
    
    return parseVideoList(response.data);
}

async function loadDetail(link) {
    const fullUrl = ensureAbsoluteUrl(link);
    const idMatch = link.match(/\/archives\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : link;
    
    const response = await Widget.http.get(fullUrl, { headers: HEADERS });
    if (!response || !response.data) throw new Error("详情页加载失败");
    
    const videoData = extractVideoUrl(response.data);
    if (!videoData || !videoData.videoUrl) throw new Error("无法获取视频链接");
    
    let videoUrl = videoData.videoUrl;
    if (!videoUrl.startsWith("http")) videoUrl = ensureAbsoluteUrl(videoUrl);
    
    const $ = Widget.html.load(response.data);
    const title = $("h1.post-title").text().trim() || $("title").text().trim() || "视频播放";
    const coverUrl = extractCoverFromDetail(response.data);
    
    return {
        id: videoId,
        type: "detail",
        mediaType: "movie",
        title: title,
        coverUrl: coverUrl,
        videoUrl: videoUrl,
        customHeaders: { "Referer": fullUrl, "User-Agent": HEADERS["User-Agent"] },
        childItems: []
    };
}

module.exports = {
    metadata: WidgetMetadata,
    getLatestVideos: getLatestVideos,
    getCategoryVideos: getCategoryVideos,
    loadDetail: loadDetail
};
