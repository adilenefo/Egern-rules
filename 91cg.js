WidgetMetadata = {
    id: "91CG",
    title: "91瓜叔",
    version: "1.0.6",
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
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9"
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
    
    console.log("[parseVideoList] 开始解析HTML，长度: " + html.length);
    
    // 尝试多种选择器
    let articles = $("article[itemscope]");
    console.log("[parseVideoList] article[itemscope] 数量: " + articles.length);
    
    if (articles.length === 0) {
        articles = $("article");
        console.log("[parseVideoList] article 数量: " + articles.length);
    }
    
    if (articles.length === 0) {
        articles = $(".post-card, .video-item, .item");
        console.log("[parseVideoList] .post-card 数量: " + articles.length);
    }
    
    // 尝试从脚本提取封面映射
    const coverMap = {};
    const scriptRegex = /loadBannerDirect\s*\(\s*'([^']+)'\s*,\s*'[^']*'\s*,\s*document\.querySelector\s*\(\s*'#post-card-(\d+)'\s*\)/g;
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(html)) !== null) {
        if (scriptMatch[1] && scriptMatch[2]) {
            coverMap[scriptMatch[2]] = scriptMatch[1];
        }
    }
    console.log("[parseVideoList] 封面映射数量: " + Object.keys(coverMap).length);
    
    articles.each(function() {
        const $article = $(this);
        
        // 尝试多种方式获取链接
        let linkEl = $article.find("a[href*='/archives/']").first();
        if (!linkEl.length) {
            linkEl = $article.find("a[href*='archives']").first();
        }
        if (!linkEl.length) {
            linkEl = $article.find("a").first();
        }
        
        let link = linkEl.attr("href") || "";
        const idMatch = link.match(/\/archives\/(\d+)/) || link.match(/archives\/(\d+)/);
        
        if (!idMatch) {
            console.log("[parseVideoList] 跳过无效链接: " + link);
            return;
        }
        
        const videoId = idMatch[1];
        link = ensureAbsoluteUrl(link);
        
        // 尝试多种方式获取标题
        let title = $article.find("h2 a").text().trim() ||
                    $article.find("h2").text().trim() ||
                    $article.find(".post-card-title").text().trim() ||
                    $article.find(".title").text().trim() ||
                    linkEl.attr("title") ||
                    linkEl.text().trim() ||
                    "未知标题";
        
        // 获取封面
        let coverUrl = coverMap[videoId] || "";
        if (!coverUrl) {
            const img = $article.find("img").first();
            if (img.length) {
                coverUrl = img.attr("data-xkrkllgl") || 
                          img.attr("data-original") ||
                          img.attr("data-src") || 
                          img.attr("src") || "";
                if (coverUrl.startsWith("data:")) coverUrl = "";
            }
        }
        
        const tags = $article.find(".wraps, .tags, .category").text().trim();
        
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
    
    console.log("[parseVideoList] 解析完成，视频数量: " + result.length);
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
    
    const contentImg = $(".post-content img, .entry-content img, article img, .content img").first();
    if (contentImg.length) {
        coverUrl = contentImg.attr('data-xkrkllgl') || 
                   contentImg.attr('data-original') ||
                   contentImg.attr('src') || "";
        if (coverUrl && !coverUrl.startsWith('data:')) return coverUrl;
    }
    
    return "";
}

function extractVideoUrl(html) {
    // 方法1: data-config JSON
    let match = html.match(/data-config\s*=\s*'(\{[^']+\})'/i);
    if (match && match[1]) {
        try {
            const config = JSON.parse(match[1].replace(/\\\//g, '/'));
            if (config.video && config.video.url) {
                console.log("[extractVideoUrl] 从data-config提取到URL");
                return { videoUrl: config.video.url.replace(/\\\//g, '/'), type: "hls" };
            }
        } catch (e) {
            console.log("[extractVideoUrl] 解析data-config失败: " + e.message);
        }
    }
    
    // 方法2: 直接匹配m3u8 URL
    match = html.match(/"url"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
    if (match && match[1]) {
        console.log("[extractVideoUrl] 从url字段提取到m3u8");
        return { videoUrl: match[1].replace(/\\\//g, '/'), type: "hls" };
    }
    
    // 方法3: 匹配hls域名
    match = html.match(/https?:\/\/hls\.[^"'\s<>\\]+\.m3u8[^"'\s<>\\]*/i);
    if (match) {
        console.log("[extractVideoUrl] 从HTML匹配到hls链接");
        return { videoUrl: match[0].replace(/\\\//g, '/'), type: "hls" };
    }
    
    // 方法4: 匹配任意m3u8链接
    match = html.match(/https?:\/\/[^"'\s<>\\]+\.m3u8[^"'\s<>\\]*/i);
    if (match) {
        console.log("[extractVideoUrl] 匹配到通用m3u8链接");
        return { videoUrl: match[0].replace(/\\\//g, '/'), type: "hls" };
    }
    
    console.log("[extractVideoUrl] 未找到视频链接");
    return null;
}

async function getLatestVideos(params = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    let url = page > 1 ? `${BASE_URL}/page/${page}/` : `${BASE_URL}/`;
    
    console.log("[getLatestVideos] 请求URL: " + url);
    
    try {
        const response = await Widget.http.get(url, { headers: HEADERS });
        
        if (!response) {
            console.log("[getLatestVideos] 响应为空");
            throw new Error("网络请求失败");
        }
        
        if (!response.data) {
            console.log("[getLatestVideos] 响应数据为空，状态码: " + response.statusCode);
            throw new Error("页面加载失败");
        }
        
        console.log("[getLatestVideos] 响应长度: " + response.data.length);
        
        const result = parseVideoList(response.data);
        
        if (result.length === 0) {
            console.log("[getLatestVideos] 未解析到视频，HTML前500字符: " + response.data.substring(0, 500));
            throw new Error("未找到视频数据");
        }
        
        return result;
    } catch (error) {
        console.log("[getLatestVideos] 错误: " + error.message);
        throw error;
    }
}

async function getCategoryVideos(params = {}) {
    const category = params.category || "zxcghl";
    const page = Math.max(1, Number(params.page) || 1);
    let url = `${BASE_URL}/category/${category}/`;
    if (page > 1) url = `${BASE_URL}/category/${category}/page/${page}/`;
    
    console.log("[getCategoryVideos] 请求URL: " + url);
    
    try {
        const response = await Widget.http.get(url, { headers: HEADERS });
        
        if (!response || !response.data) {
            throw new Error("页面加载失败");
        }
        
        console.log("[getCategoryVideos] 响应长度: " + response.data.length);
        
        const result = parseVideoList(response.data);
        
        if (result.length === 0) {
            throw new Error("未找到视频数据");
        }
        
        return result;
    } catch (error) {
        console.log("[getCategoryVideos] 错误: " + error.message);
        throw error;
    }
}

async function loadDetail(link) {
    const fullUrl = ensureAbsoluteUrl(link);
    const idMatch = link.match(/\/archives\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : link;
    
    console.log("[loadDetail] 请求URL: " + fullUrl);
    
    try {
        const response = await Widget.http.get(fullUrl, { headers: HEADERS });
        
        if (!response || !response.data) {
            throw new Error("详情页加载失败");
        }
        
        const videoData = extractVideoUrl(response.data);
        if (!videoData || !videoData.videoUrl) {
            throw new Error("无法获取视频链接");
        }
        
        let videoUrl = videoData.videoUrl;
        if (!videoUrl.startsWith("http")) videoUrl = ensureAbsoluteUrl(videoUrl);
        
        const $ = Widget.html.load(response.data);
        const title = $("h1.post-title").text().trim() || 
                      $("h1").first().text().trim() ||
                      $("title").text().trim() || 
                      "视频播放";
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
    } catch (error) {
        console.log("[loadDetail] 错误: " + error.message);
        throw error;
    }
}

module.exports = {
    metadata: WidgetMetadata,
    getLatestVideos: getLatestVideos,
    getCategoryVideos: getCategoryVideos,
    loadDetail: loadDetail
};
