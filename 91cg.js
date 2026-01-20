WidgetMetadata = {
    id: "91CG",
    title: "91瓜叔",
    version: "1.0.3",
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
            id: "todayMelons",
            title: "🍉 今日吃瓜",
            functionName: "getCategoryVideos",
            cacheDuration: 300,
            params: [
                { name: "category", title: "分类", type: "constant", value: "zxcghl" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "hotVideos",
            title: "🔥 最高点击",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "rsdg" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "mustWatch",
            title: "⭐ 必吃大瓜",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "bcdg" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "teacher",
            title: "👩‍🏫 师生专栏",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "xsjlb" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "nightVideos",
            title: "🌙 深夜撸片",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "lpsd" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "haijiao",
            title: "🔞 海角乱伦",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "hjll" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "dailyContest",
            title: "🏆 每日大赛",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "mrds" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "wanghong",
            title: "💋 网红黑料",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "whhl" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "anime",
            title: "🎌 成人动漫",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "crdm" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "starScandal",
            title: "🌟 明星黑料",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "mxhl" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "selfie",
            title: "📷 自拍偷拍",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "zptp" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "tanhua",
            title: "🌸 91探花",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "91th" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "extreme",
            title: "⚠️ 猎奇重口",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "lqzk" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "starAI",
            title: "🤖 明星AI",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "aikj" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "socialNews",
            title: "📰 社会奇闻",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "qwys" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "contrast",
            title: "💃 反差靓女",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "fclv" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "shortDrama",
            title: "🎬 擦边短剧",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "dydj" },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        },
        {
            id: "wanghuang",
            title: "🎀 网黄合集",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                { name: "category", title: "分类", type: "constant", value: "gcwh" },
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

// ==================== 配置 ====================
const BASE_URL = "https://91cg1.com";
const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/137.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": BASE_URL + "/"
};

// ==================== 工具函数 ====================
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

// 从整个HTML提取所有封面映射
function extractAllCovers(html) {
    const coverMap = {};
    
    // 先找到所有封面URL（pic.hqcwcib.cn 域名）
    const urlMatches = html.match(/loadBannerDirect\s*\(\s*'(https?:\/\/pic\.[^']+)'/g) || [];
    const urls = urlMatches.map(m => {
        const match = m.match(/'(https?:\/\/pic\.[^']+)'/);
        return match ? match[1] : null;
    }).filter(Boolean);
    
    // 找到所有 post-card ID（按顺序）
    const idMatches = html.match(/#post-card-(\d+)/g) || [];
    const ids = [];
    const seenIds = {};
    for (const m of idMatches) {
        const match = m.match(/#post-card-(\d+)/);
        if (match && !seenIds[match[1]]) {
            ids.push(match[1]);
            seenIds[match[1]] = true;
        }
    }
    
    console.log(`[extractAllCovers] 找到 ${urls.length} 个封面URL, ${ids.length} 个post-card ID`);
    
    // 方法1: 尝试精确匹配每个调用
    const callRegex = /loadBannerDirect\s*\(\s*'([^']+)'\s*,\s*'[^']*'\s*,\s*document\.querySelector\s*\(\s*'#post-card-(\d+)'\s*\)/g;
    let match;
    while ((match = callRegex.exec(html)) !== null) {
        if (match[1] && match[2] && match[1].includes('pic.')) {
            coverMap[match[2]] = match[1];
        }
    }
    
    // 方法2: 如果方法1没结果，按顺序配对
    if (Object.keys(coverMap).length === 0 && urls.length > 0 && ids.length > 0) {
        console.log("[extractAllCovers] 使用顺序配对方法");
        for (let i = 0; i < Math.min(urls.length, ids.length); i++) {
            coverMap[ids[i]] = urls[i];
        }
    }
    
    console.log(`[extractAllCovers] 最终提取到 ${Object.keys(coverMap).length} 个封面`);
    
    return coverMap;
}

// 解析视频列表 - 尝试提取文章内图片作为封面
function parseVideoList(html) {
    const $ = Widget.html.load(html);
    const result = [];
    
    $("article[itemscope]").each(function() {
        const $article = $(this);
        
        // 提取链接和ID
        const linkEl = $article.find("a[href*='/archives/']").first();
        let link = linkEl.attr("href") || "";
        const idMatch = link.match(/\/archives\/(\d+)/);
        
        if (!idMatch) return;
        
        const videoId = idMatch[1];
        link = ensureAbsoluteUrl(link);
        
        // 提取标题
        const title = $article.find("h2").text().trim() ||
                      $article.find(".post-card-title").text().trim() ||
                      linkEl.attr("title") ||
                      "未知标题";
        
        // 尝试从 meta 标签提取 og:image（如果存在）
        let coverUrl = "";
        
        // 尝试从 script 中提取图片URL（不带防盗链的备用图）
        const scriptText = $article.html() || "";
        
        // 方法1: 尝试提取 data-xkrkllgl 属性（这是实际图片URL）
        const xkrkMatch = scriptText.match(/data-xkrkllgl="([^"]+)"/);
        if (xkrkMatch && xkrkMatch[1]) {
            coverUrl = xkrkMatch[1];
        }
        
        // 方法2: 尝试从 loadImage 调用中提取
        if (!coverUrl) {
            const loadImgMatch = scriptText.match(/loadImage\s*\(\s*"([^"]+)"/);
            if (loadImgMatch && loadImgMatch[1]) {
                coverUrl = loadImgMatch[1];
            }
        }
        
        // 提取标签
        const tags = $article.find(".wraps").text().trim();
        
        result.push({
            id: videoId,
            type: "link",
            mediaType: "movie",
            title: title,
            coverUrl: coverUrl,
            previewUrl: "",
            duration: 0,
            durationText: "",
            link: link,
            description: tags || ""
        });
    });
    
    return result;
}

// 从详情页提取封面图片
function extractCoverFromDetail(html) {
    const $ = Widget.html.load(html);
    
    // 方法1: 从文章图片的 data-xkrkllgl 属性提取（实际图片URL）
    const imgWithData = $('img[data-xkrkllgl]').first();
    if (imgWithData.length) {
        const coverUrl = imgWithData.attr('data-xkrkllgl');
        if (coverUrl) return coverUrl;
    }
    
    // 方法2: 从 og:image meta 标签提取
    let coverUrl = $('meta[property="og:image"]').attr('content') || "";
    if (coverUrl) return coverUrl;
    
    // 方法3: 从文章内容中提取第一张图片的 src
    const contentImg = $(".post-content img, .entry-content img, article img").first();
    if (contentImg.length) {
        // 优先取 data-xkrkllgl，其次取 src
        coverUrl = contentImg.attr('data-xkrkllgl') || contentImg.attr('src') || contentImg.attr('data-src') || "";
        if (coverUrl && !coverUrl.startsWith('data:')) return coverUrl;
    }
    
    // 方法4: 从视频播放器封面提取
    const posterImg = $('video[poster]').attr('poster') || 
                      $('[data-poster]').attr('data-poster') || "";
    if (posterImg) return posterImg;
    
    return "";
}

async function getLatestVideos(params = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    let url = page > 1 ? `${BASE_URL}/page/${page}/` : BASE_URL;
    
    console.log(`[getLatestVideos] URL: ${url}`);
    
    const response = await Widget.http.get(url, { headers: HEADERS });
    if (!response || !response.data) throw new Error("页面加载失败");
    
    const result = parseVideoList(response.data);
    console.log(`[getLatestVideos] 解析到 ${result.length} 个视频`);
    return result;
}

async function getCategoryVideos(params = {}) {
    const category = params.category || "zxcghl";
    const page = Math.max(1, Number(params.page) || 1);
    let url = `${BASE_URL}/category/${category}/`;
    if (page > 1) url = `${BASE_URL}/category/${category}/page/${page}/`;
    
    console.log(`[getCategoryVideos] URL: ${url}`);
    
    const response = await Widget.http.get(url, { headers: HEADERS });
    if (!response || !response.data) throw new Error("页面加载失败");
    
    const result = parseVideoList(response.data);
    console.log(`[getCategoryVideos] 解析到 ${result.length} 个视频`);
    return result;
}

function extractVideoUrl(html) {
    // 方法1: data-config JSON
    let match = html.match(/data-config\s*=\s*'(\{[^']+\})'/i);
    if (match && match[1]) {
        try {
            const config = JSON.parse(match[1].replace(/\\\//g, '/'));
            if (config.video && config.video.url) {
                return { videoUrl: config.video.url.replace(/\\\//g, '/'), type: "hls" };
            }
        } catch (e) {}
    }
    
    // 方法2: 直接匹配m3u8 URL
    match = html.match(/"url"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
    if (match && match[1]) {
        return { videoUrl: match[1].replace(/\\\//g, '/'), type: "hls" };
    }
    
    // 方法3: 匹配hls域名
    match = html.match(/https?:\/\/hls\.[^"'\s<>\\]+\.m3u8[^"'\s<>\\]*/i);
    if (match) {
        return { videoUrl: match[0].replace(/\\\//g, '/'), type: "hls" };
    }
    
    return null;
}

async function loadDetail(link) {
    console.log(`[loadDetail] 加载: ${link}`);
    
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
    
    // 尝试提取封面图片
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
