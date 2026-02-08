/**
 * 91瓜叔 - 视频解析插件
 * 版本: 2.0.0 (优化版)
 * 作者: Forward
 * 优化: Claude
 */

// ==================== 常量定义 ====================
const BASE_URL = "https://91cg1.com";

const HEADERS = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9"
};

// 预编译正则表达式（性能优化）
const REGEX = {
    ARCHIVES: /\/archives\/(\d+)/,
    ARCHIVES_ALT: /archives\/(\d+)/,
    COVER_MAP: /loadBannerDirect\s*\(\s*'([^']+)'\s*,\s*'[^']*'\s*,\s*document\.querySelector\s*\(\s*'#post-card-(\d+)'\s*\)/g,
    DATA_CONFIG: /data-config\s*=\s*'(\{[^']+\})'/i,
    M3U8_URL: /"url"\s*:\s*"([^"]+\.m3u8[^"]*)"/i,
    M3U8_HLS: /https?:\/\/hls\.[^"'\s<>\\]+\.m3u8[^"'\s<>\\]*/i,
    M3U8_GENERAL: /https?:\/\/[^"'\s<>\\]+\.m3u8[^"'\s<>\\]*/i,
    SCRIPT_CONTENT: /loadBanner|decryptImage/
};

// 分类配置
const CATEGORIES = [
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
];

// ==================== 元数据配置 ====================
var WidgetMetadata = {
    id: "91CG",
    title: "91瓜叔",
    version: "2.0.0",
    requiredVersion: "0.0.1",
    description: "91瓜叔 - 在线吃瓜（优化版）",
    author: "Forward",
    site: BASE_URL,
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
            id: "searchVideos",
            title: "🔍 搜索视频",
            functionName: "searchVideos",
            cacheDuration: 300,
            params: [
                { name: "keyword", title: "关键词", type: "input", value: "" },
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
                    enumOptions: CATEGORIES
                },
                { name: "page", title: "页码", type: "page", value: "1" }
            ]
        }
    ]
};

// ==================== 工具函数 ====================

/**
 * 清理URL中的换行和空白
 */
function trimUrl(url) {
    return url ? url.replace(/\r?\n|\r/g, "").trim() : "";
}

/**
 * 确保URL为绝对路径
 */
function ensureAbsoluteUrl(url) {
    if (!url) return "";
    url = trimUrl(url);
    if (url.startsWith("//")) return "https:" + url;
    if (url.startsWith("/")) return BASE_URL + url;
    if (!url.startsWith("http")) return BASE_URL + "/" + url;
    return url;
}

/**
 * 日志输出（统一格式）
 */
function log(tag, message) {
    console.log(`[${tag}] ${message}`);
}

/**
 * 带重试的HTTP GET请求
 */
async function httpGetWithRetry(url, options = {}, maxRetries = 2) {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
        try {
            const response = await Widget.http.get(url, { headers: HEADERS, ...options });
            if (response && response.data) {
                return response;
            }
            lastError = new Error("响应数据为空");
        } catch (e) {
            lastError = e;
            if (i < maxRetries) {
                log("HTTP", `第${i + 1}次请求失败，正在重试...`);
            }
        }
    }
    
    throw lastError;
}

/**
 * 清理URL中的转义斜杠
 */
function cleanUrl(url) {
    return url ? url.replace(/\\\//g, '/') : "";
}

// ==================== 提取函数 ====================

/**
 * 从文章元素中提取标题
 */
function extractTitle($, $article, linkEl) {
    const titleMethods = [
        // 方法1: 从 h2 > a 的 title 属性获取
        () => $article.find("h2 a").attr("title"),
        
        // 方法2: 克隆 h2 元素，移除脚本后获取文本
        () => {
            const $h2 = $article.find("h2").first().clone();
            $h2.find("script").remove();
            return $h2.text().trim();
        },
        
        // 方法3: 从 .post-card-title 获取
        () => {
            const $titleEl = $article.find(".post-card-title").first().clone();
            $titleEl.find("script").remove();
            return $titleEl.text().trim();
        },
        
        // 方法4: 从链接的 title 属性获取
        () => linkEl.attr("title"),
        
        // 方法5: 从链接文本获取（排除脚本内容）
        () => {
            const $linkClone = linkEl.clone();
            $linkClone.find("script").remove();
            return $linkClone.text().trim();
        }
    ];
    
    for (const method of titleMethods) {
        try {
            const title = method();
            if (title && !REGEX.SCRIPT_CONTENT.test(title)) {
                return title.replace(/\s+/g, ' ').trim();
            }
        } catch (e) {
            // 继续尝试下一个方法
        }
    }
    
    return "未知标题";
}

/**
 * 从文章元素中提取封面URL
 */
function extractCoverUrl($article, coverMap, videoId) {
    // 优先从封面映射获取
    if (coverMap[videoId]) {
        return coverMap[videoId];
    }
    
    const img = $article.find("img").first();
    if (!img.length) return "";
    
    // 尝试多种图片属性
    const imgAttrs = ["data-xkrkllgl", "data-original", "data-src", "src"];
    
    for (const attr of imgAttrs) {
        const url = img.attr(attr);
        if (url && !url.startsWith("data:")) {
            return url;
        }
    }
    
    return "";
}

/**
 * 从HTML中提取封面映射
 */
function extractCoverMap(html) {
    const coverMap = {};
    // 重置正则的lastIndex
    REGEX.COVER_MAP.lastIndex = 0;
    
    let match;
    while ((match = REGEX.COVER_MAP.exec(html)) !== null) {
        if (match[1] && match[2]) {
            coverMap[match[2]] = match[1];
        }
    }
    
    return coverMap;
}

/**
 * 从详情页提取封面
 */
function extractCoverFromDetail(html) {
    const $ = Widget.html.load(html);
    
    // 方法1: 从特定数据属性获取
    const imgWithData = $('img[data-xkrkllgl]').first();
    if (imgWithData.length) {
        const coverUrl = imgWithData.attr('data-xkrkllgl');
        if (coverUrl) return coverUrl;
    }
    
    // 方法2: 从 og:image meta 标签获取
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) return ogImage;
    
    // 方法3: 从内容区域图片获取
    const contentSelectors = ".post-content img, .entry-content img, article img, .content img";
    const contentImg = $(contentSelectors).first();
    
    if (contentImg.length) {
        const imgAttrs = ["data-xkrkllgl", "data-original", "src"];
        for (const attr of imgAttrs) {
            const url = contentImg.attr(attr);
            if (url && !url.startsWith('data:')) return url;
        }
    }
    
    return "";
}

/**
 * 从HTML中提取视频URL
 */
function extractVideoUrl(html) {
    const extractMethods = [
        // 方法1: 从 data-config JSON 提取
        {
            regex: REGEX.DATA_CONFIG,
            handler: (match) => {
                try {
                    const config = JSON.parse(cleanUrl(match[1]));
                    if (config.video && config.video.url) {
                        log("extractVideoUrl", "从data-config提取到URL");
                        return { videoUrl: cleanUrl(config.video.url), type: "hls" };
                    }
                } catch (e) {
                    log("extractVideoUrl", "解析data-config失败: " + e.message);
                }
                return null;
            }
        },
        // 方法2: 直接匹配 url 字段中的 m3u8
        {
            regex: REGEX.M3U8_URL,
            handler: (match) => {
                log("extractVideoUrl", "从url字段提取到m3u8");
                return { videoUrl: cleanUrl(match[1]), type: "hls" };
            }
        },
        // 方法3: 匹配 hls 域名的 m3u8
        {
            regex: REGEX.M3U8_HLS,
            handler: (match) => {
                log("extractVideoUrl", "从HTML匹配到hls链接");
                return { videoUrl: cleanUrl(match[0]), type: "hls" };
            }
        },
        // 方法4: 匹配任意 m3u8 链接
        {
            regex: REGEX.M3U8_GENERAL,
            handler: (match) => {
                log("extractVideoUrl", "匹配到通用m3u8链接");
                return { videoUrl: cleanUrl(match[0]), type: "hls" };
            }
        }
    ];
    
    for (const method of extractMethods) {
        const match = html.match(method.regex);
        if (match) {
            const result = method.handler(match);
            if (result) return result;
        }
    }
    
    log("extractVideoUrl", "未找到视频链接");
    return null;
}

// ==================== 解析函数 ====================

/**
 * 解析视频列表
 */
function parseVideoList(html) {
    const $ = Widget.html.load(html);
    const result = [];
    
    // 尝试多种选择器获取文章列表
    const selectors = ["article[itemscope]", "article", ".post-card, .video-item, .item"];
    let articles = $();
    
    for (const selector of selectors) {
        articles = $(selector);
        if (articles.length > 0) break;
    }
    
    if (articles.length === 0) {
        log("parseVideoList", "未找到文章元素");
        return result;
    }
    
    // 提取封面映射
    const coverMap = extractCoverMap(html);
    
    articles.each(function() {
        const $article = $(this);
        
        // 查找链接元素
        const linkSelectors = ["a[href*='/archives/']", "a[href*='archives']", "a"];
        let linkEl = $();
        
        for (const selector of linkSelectors) {
            linkEl = $article.find(selector).first();
            if (linkEl.length) break;
        }
        
        const href = linkEl.attr("href") || "";
        const idMatch = href.match(REGEX.ARCHIVES) || href.match(REGEX.ARCHIVES_ALT);
        
        if (!idMatch) return;
        
        const videoId = idMatch[1];
        const link = ensureAbsoluteUrl(href);
        const title = extractTitle($, $article, linkEl);
        const coverUrl = extractCoverUrl($article, coverMap, videoId);
        const tags = $article.find(".wraps, .tags, .category").text().trim();
        
        result.push({
            id: videoId,
            type: "link",
            title: title,
            mediaType: "movie",
            posterPath: coverUrl,
            backdropPath: coverUrl,
            link: link,
            description: tags || ""
        });
    });
    
    log("parseVideoList", `解析到 ${result.length} 个视频`);
    return result;
}

// ==================== 公共请求函数 ====================

/**
 * 获取视频列表（公共方法）
 */
async function fetchVideoList(url, logTag) {
    log(logTag, "请求URL: " + url);
    
    try {
        const response = await httpGetWithRetry(url);
        log(logTag, "响应长度: " + response.data.length);
        
        const result = parseVideoList(response.data);
        
        if (result.length === 0) {
            log(logTag, "未解析到视频，HTML前500字符: " + response.data.substring(0, 500));
            throw new Error("未找到视频数据");
        }
        
        return result;
    } catch (error) {
        log(logTag, "错误: " + error.message);
        throw error;
    }
}

// ==================== 主要API函数 ====================

/**
 * 获取最新视频
 */
async function getLatestVideos(params = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const url = page > 1 ? `${BASE_URL}/page/${page}/` : `${BASE_URL}/`;
    return fetchVideoList(url, "getLatestVideos");
}

/**
 * 获取分类视频
 */
async function getCategoryVideos(params = {}) {
    const category = params.category || "zxcghl";
    const page = Math.max(1, Number(params.page) || 1);
    const url = page > 1 
        ? `${BASE_URL}/category/${category}/page/${page}/` 
        : `${BASE_URL}/category/${category}/`;
    return fetchVideoList(url, "getCategoryVideos");
}

/**
 * 搜索视频（新增功能）
 */
async function searchVideos(params = {}) {
    const keyword = (params.keyword || "").trim();
    const page = Math.max(1, Number(params.page) || 1);
    
    if (!keyword) {
        log("searchVideos", "关键词为空");
        return [];
    }
    
    const url = page > 1
        ? `${BASE_URL}/page/${page}/?s=${encodeURIComponent(keyword)}`
        : `${BASE_URL}/?s=${encodeURIComponent(keyword)}`;
    
    return fetchVideoList(url, "searchVideos");
}

/**
 * 加载视频详情
 */
async function loadDetail(link) {
    const fullUrl = ensureAbsoluteUrl(link);
    const idMatch = link.match(REGEX.ARCHIVES);
    const videoId = idMatch ? idMatch[1] : link;
    
    log("loadDetail", "加载详情: " + fullUrl);
    
    try {
        const response = await httpGetWithRetry(fullUrl);
        
        // 提取视频URL
        const videoData = extractVideoUrl(response.data);
        if (!videoData || !videoData.videoUrl) {
            throw new Error("无法获取视频链接");
        }
        
        let videoUrl = videoData.videoUrl;
        if (!videoUrl.startsWith("http")) {
            videoUrl = ensureAbsoluteUrl(videoUrl);
        }
        
        // 提取标题
        const $ = Widget.html.load(response.data);
        const title = $("h1.post-title").text().trim() || 
                      $("h1").first().text().trim() ||
                      $("title").text().trim() || 
                      "视频播放";
        
        // 提取封面
        const coverUrl = extractCoverFromDetail(response.data);
        
        log("loadDetail", `标题: ${title}, 视频URL: ${videoUrl.substring(0, 50)}...`);
        
        return {
            id: videoId,
            type: "url",
            title: title,
            mediaType: "movie",
            posterPath: coverUrl,
            backdropPath: coverUrl,
            videoUrl: videoUrl,
            link: fullUrl,
            customHeaders: { 
                "Referer": fullUrl, 
                "User-Agent": HEADERS["User-Agent"] 
            },
            childItems: []
        };
    } catch (error) {
        log("loadDetail", "错误: " + error.message);
        throw error;
    }
}

// ==================== 模块导出 ====================
module.exports = {
    metadata: WidgetMetadata,
    getLatestVideos: getLatestVideos,
    getCategoryVideos: getCategoryVideos,
    searchVideos: searchVideos,
    loadDetail: loadDetail
};
