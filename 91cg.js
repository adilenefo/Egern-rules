WidgetMetadata = {
    id: "91CG",
    title: "91瓜叔",
    version: "1.0.1",
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
                        { title: "必吃大瓜", value: "bcdg" }
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
    
    // 方法1: 精确匹配 loadBannerDirect 调用
    // 格式: loadBannerDirect('图片URL', '', document.querySelector('#post-card-数字'), ...)
    // 使用 [\s\S] 来匹配包括换行在内的任意字符
    const regex1 = /loadBannerDirect\s*\(\s*'(https?:\/\/[^']+)'[\s\S]*?#post-card-(\d+)/g;
    
    let match;
    while ((match = regex1.exec(html)) !== null) {
        const coverUrl = match[1];
        const postId = match[2];
        if (coverUrl && postId && coverUrl.includes('pic.')) {
            coverMap[postId] = coverUrl;
        }
    }
    
    // 方法2: 如果方法1没找到，尝试分段匹配
    if (Object.keys(coverMap).length === 0) {
        console.log("[extractAllCovers] 方法1未匹配，尝试方法2");
        
        // 匹配所有 loadBannerDirect 调用块
        const blockRegex = /loadBannerDirect\s*\([^;]+;/g;
        let blockMatch;
        
        while ((blockMatch = blockRegex.exec(html)) !== null) {
            const block = blockMatch[0];
            
            // 从块中提取URL
            const urlMatch = block.match(/'(https?:\/\/pic\.[^']+)'/);
            // 从块中提取ID
            const idMatch = block.match(/#post-card-(\d+)/);
            
            if (urlMatch && idMatch) {
                coverMap[idMatch[1]] = urlMatch[1];
            }
        }
    }
    
    // 方法3: 最宽松的匹配 - 直接找所有pic域名图片和post-card ID的配对
    if (Object.keys(coverMap).length === 0) {
        console.log("[extractAllCovers] 方法2未匹配，尝试方法3");
        
        // 找所有包含 loadBannerDirect 和 pic. 的行
        const lines = html.split('\n');
        for (const line of lines) {
            if (line.includes('loadBannerDirect') && line.includes('pic.')) {
                const urlMatch = line.match(/'(https?:\/\/pic\.[^']+)'/);
                const idMatch = line.match(/#post-card-(\d+)/);
                if (urlMatch && idMatch) {
                    coverMap[idMatch[1]] = urlMatch[1];
                }
            }
        }
    }
    
    console.log(`[extractAllCovers] 总共提取到 ${Object.keys(coverMap).length} 个封面`);
    
    // 输出前3个作为示例
    const keys = Object.keys(coverMap).slice(0, 3);
    keys.forEach(k => console.log(`  示例: ID=${k}, URL=${coverMap[k].substring(0, 50)}...`));
    
    return coverMap;
}

// 解析视频列表
function parseVideoList(html) {
    const $ = Widget.html.load(html);
    const coverMap = extractAllCovers(html);
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
        
        // 提取封面 - 从coverMap获取
        let coverUrl = coverMap[videoId] || "";
        
        // 如果coverMap没有，尝试直接从整个HTML中搜索该ID对应的封面
        if (!coverUrl) {
            // 使用更精确的正则匹配该视频ID的封面
            const specificRegex = new RegExp(`loadBannerDirect\\s*\\(\\s*'(https?://[^']+)'[^)]*#post-card-${videoId}`, 'i');
            const specificMatch = html.match(specificRegex);
            if (specificMatch && specificMatch[1]) {
                coverUrl = specificMatch[1];
                console.log(`[parseVideoList] 单独匹配到封面: ID=${videoId}`);
            }
        }
        
        // 提取标签
        const tags = $article.find(".wraps").text().trim();
        
        console.log(`[parseVideoList] 视频: ID=${videoId}, 封面=${coverUrl ? '有' : '无'}`);
        
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

// ==================== 主功能 ====================
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
    
    return {
        id: videoId,
        type: "detail",
        mediaType: "movie",
        title: title,
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
