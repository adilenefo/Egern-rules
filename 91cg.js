WidgetMetadata = {
    id: "91CG",
    title: "91瓜叔",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "91瓜叔 - 在线吃瓜（需VPN访问）",
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
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    value: "1"
                }
            ]
        },
        {
            id: "todayMelons",
            title: "🍉 今日吃瓜",
            functionName: "getCategoryVideos",
            cacheDuration: 300,
            params: [
                {
                    name: "category",
                    title: "分类",
                    type: "constant",
                    value: "zxcghl"
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    value: "1"
                }
            ]
        },
        {
            id: "hotVideos",
            title: "🔥 最高点击",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "分类",
                    type: "constant",
                    value: "rsdg"
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    value: "1"
                }
            ]
        },
        {
            id: "mustWatch",
            title: "⭐ 必吃大瓜",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "分类",
                    type: "constant",
                    value: "bcdg"
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    value: "1"
                }
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
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    value: "1"
                }
            ]
        }
    ]
};

// ==================== 配置区域 ====================
const BASE_URL = "https://91cg1.com";

const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/137.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": BASE_URL + "/"
};

// ==================== 工具函数 ====================

// 清理URL中的换行符和首尾空格
function trimUrl(url) {
    return url ? url.replace(/\r?\n|\r/g, "").trim() : "";
}

// 确保URL是完整的绝对路径
function ensureAbsoluteUrl(url) {
    if (!url) return "";
    url = trimUrl(url);
    if (url.startsWith("//")) return "https:" + url;
    if (url.startsWith("/")) return BASE_URL + url;
    if (!url.startsWith("http")) return BASE_URL + "/" + url;
    return url;
}

// 从background-image样式中提取URL
function extractBackgroundImageUrl(style) {
    if (!style) return "";
    // 匹配 url("...") 或 url('...') 或 url(...)
    const match = style.match(/url\s*\(\s*["']?([^"')]+)["']?\s*\)/i);
    if (match && match[1]) {
        // 如果是base64，直接返回
        if (match[1].startsWith("data:")) {
            return match[1];
        }
        return ensureAbsoluteUrl(match[1]);
    }
    return "";
}

// 从视频列表项中提取视频信息
function extractVideoInfo($, element) {
    const $article = $(element);
    
    // 提取视频链接
    const linkEl = $article.find("a[href*='/archives/']").first();
    let link = linkEl.attr("href") || "";
    link = ensureAbsoluteUrl(link);
    
    // 从链接中提取视频ID
    const idMatch = link.match(/\/archives\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : "";
    
    if (!videoId) {
        // 尝试从post-card的id属性获取
        const cardEl = $article.find(".post-card[id^='post-card-']");
        if (cardEl.length) {
            const cardId = cardEl.attr("id") || "";
            const cardIdMatch = cardId.match(/post-card-(\d+)/);
            if (cardIdMatch) {
                return extractVideoInfoById($, element, cardIdMatch[1]);
            }
        }
        return null;
    }
    
    return extractVideoInfoById($, element, videoId);
}

// 根据ID提取视频信息
function extractVideoInfoById($, element, videoId) {
    const $article = $(element);
    
    // 构建链接
    const link = ensureAbsoluteUrl(`/archives/${videoId}/`);
    
    // 提取标题
    const title = $article.find("h2").text().trim() ||
                  $article.find(".post-card-info h2").text().trim() ||
                  $article.find("a[href*='/archives/']").attr("title") ||
                  $article.find("a[href*='/archives/']").text().trim() ||
                  "未知标题";
    
    // 提取封面图 - 从 loadBannerDirect 脚本中提取
    let coverUrl = "";
    
    // 方法1: 从 script 标签中提取 loadBannerDirect 的第一个参数（封面URL）
    // 匹配: loadBannerDirect('URL', '', document.querySelector('#post-card-101201'), ...)
    const scriptContent = $article.find("script").text() || "";
    const postCardId = `post-card-${videoId}`;
    
    // 正则匹配 loadBannerDirect('封面URL', ...)
    const bannerMatch = scriptContent.match(/loadBannerDirect\s*\(\s*['"]([^'"]+)['"]/);
    if (bannerMatch && bannerMatch[1]) {
        coverUrl = bannerMatch[1];
        console.log(`[extractVideoInfo] 从loadBannerDirect提取封面: ${coverUrl.substring(0, 50)}...`);
    }
    
    // 方法2: 如果方法1失败，尝试匹配包含该post-card-id的loadBannerDirect
    if (!coverUrl) {
        const specificBannerMatch = scriptContent.match(new RegExp(`loadBannerDirect\\s*\\(\\s*['"]([^'"]+)['"][^)]*#${postCardId}`));
        if (specificBannerMatch && specificBannerMatch[1]) {
            coverUrl = specificBannerMatch[1];
        }
    }
    
    // 方法3: 从 pic.hqcwcib.cn 域名提取图片URL
    if (!coverUrl) {
        const picMatch = scriptContent.match(/https?:\/\/pic\.hqcwcib\.cn\/[^'")\s]+/);
        if (picMatch && picMatch[0]) {
            coverUrl = picMatch[0];
        }
    }
    
    // 方法4: 从任意图片域名提取
    if (!coverUrl) {
        const imgMatch = scriptContent.match(/https?:\/\/[^'")\s]+\.(?:jpg|jpeg|png|webp|gif)/i);
        if (imgMatch && imgMatch[0]) {
            coverUrl = imgMatch[0];
        }
    }
    
    // 方法5: 从 .post-card 的 style 属性获取 background-image（备用）
    if (!coverUrl) {
        const postCard = $article.find(".post-card").first();
        if (postCard.length) {
            const style = postCard.attr("style") || "";
            if (style) {
                coverUrl = extractBackgroundImageUrl(style);
            }
        }
    }
    
    // 方法6: 从 img 标签获取（备用）
    if (!coverUrl) {
        const img = $article.find("img").first();
        if (img.length) {
            coverUrl = ensureAbsoluteUrl(
                img.attr("data-src") || 
                img.attr("data-original") || 
                img.attr("src") || 
                ""
            );
        }
    }
    
    // 确保URL是完整的
    if (coverUrl && !coverUrl.startsWith("http") && !coverUrl.startsWith("data:")) {
        coverUrl = ensureAbsoluteUrl(coverUrl);
    }
    
    // 提取作者
    let author = "";
    const authorMeta = $article.find("meta[itemprop='name']").first();
    if (authorMeta.length) {
        author = authorMeta.attr("content") || "";
    }
    
    // 提取标签
    let tags = "";
    const tagEl = $article.find(".wraps, .tag, .category");
    if (tagEl.length) {
        tags = tagEl.text().trim();
    }
    
    // 构建描述
    let description = "";
    if (author) description += `作者：${author}`;
    if (tags) description += (description ? " | " : "") + tags;
    
    console.log(`[extractVideoInfo] ID: ${videoId}, 封面: ${coverUrl ? coverUrl.substring(0, 60) + '...' : '无'}`);
    
    return {
        id: videoId,
        type: "link",
        mediaType: "movie",
        title: title,
        coverUrl: coverUrl,
        previewUrl: "",
        duration: 0,
        durationText: "",
        link: link,
        description: description
    };
}

// ==================== 主功能函数 ====================

// 获取最新视频
async function getLatestVideos(params = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    
    let url = BASE_URL;
    if (page > 1) {
        url = `${BASE_URL}/page/${page}/`;
    }
    
    console.log(`[getLatestVideos] 请求URL: ${url}`);
    
    try {
        const response = await Widget.http.get(url, { headers: HEADERS });
        
        if (!response || !response.data) {
            throw new Error("页面加载失败");
        }
        
        const $ = Widget.html.load(response.data);
        const result = [];
        
        // 视频列表选择器 - 基于Typecho Mirages主题结构
        $("article[itemscope]").each(function () {
            const videoInfo = extractVideoInfo($, this);
            if (videoInfo) {
                result.push(videoInfo);
            }
        });
        
        console.log(`[getLatestVideos] 解析到 ${result.length} 个视频`);
        return result;
        
    } catch (error) {
        console.error("[getLatestVideos] 错误:", error.message);
        throw error;
    }
}

// 获取分类视频
async function getCategoryVideos(params = {}) {
    const category = params.category || "zxcghl";
    const page = Math.max(1, Number(params.page) || 1);
    
    let url = `${BASE_URL}/category/${category}/`;
    if (page > 1) {
        url = `${BASE_URL}/category/${category}/page/${page}/`;
    }
    
    console.log(`[getCategoryVideos] 请求URL: ${url}`);
    
    try {
        const response = await Widget.http.get(url, { headers: HEADERS });
        
        if (!response || !response.data) {
            throw new Error("页面加载失败");
        }
        
        const $ = Widget.html.load(response.data);
        const result = [];
        
        // 视频列表选择器
        $("article[itemscope]").each(function () {
            const videoInfo = extractVideoInfo($, this);
            if (videoInfo) {
                result.push(videoInfo);
            }
        });
        
        console.log(`[getCategoryVideos] 解析到 ${result.length} 个视频`);
        return result;
        
    } catch (error) {
        console.error("[getCategoryVideos] 错误:", error.message);
        throw error;
    }
}

// 从HTML中提取视频播放链接
function extractVideoUrl(html) {
    try {
        // 方法1: 从DPlayer的data-config属性提取（最优先）
        let match = html.match(/data-config\s*=\s*'(\{[^']+\})'/i);
        if (match && match[1]) {
            try {
                // 处理转义字符
                let configStr = match[1].replace(/\\\//g, '/');
                const config = JSON.parse(configStr);
                if (config.video && config.video.url) {
                    console.log("[extractVideoUrl] 从data-config提取到URL");
                    const videoUrl = config.video.url.replace(/\\\//g, '/');
                    return { 
                        videoUrl: videoUrl, 
                        quality: "", 
                        type: config.video.type || (videoUrl.includes('.m3u8') ? 'hls' : 'mp4') 
                    };
                }
            } catch (e) {
                console.log("[extractVideoUrl] 解析data-config JSON失败:", e.message);
            }
        }
        
        // 方法2: 直接从data-config中用正则提取video.url
        match = html.match(/"url"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
        if (match && match[1]) {
            console.log("[extractVideoUrl] 从JSON url字段提取到URL");
            const videoUrl = match[1].replace(/\\\//g, '/');
            return { videoUrl: videoUrl, quality: "", type: "hls" };
        }
        
        // 方法3: 匹配hls域名的m3u8链接
        match = html.match(/https?:\/\/hls\.[^"'\s<>\\]+\.m3u8[^"'\s<>\\]*/i);
        if (match && match[0]) {
            console.log("[extractVideoUrl] 从hls域名提取到URL");
            const videoUrl = match[0].replace(/\\\//g, '/');
            return { videoUrl: videoUrl, quality: "", type: "hls" };
        }
        
        // 方法4: DPlayer配置 - 查找 new DPlayer 配置
        match = html.match(/new\s+DPlayer\s*\(\s*\{[\s\S]*?video\s*:\s*\{[\s\S]*?url\s*:\s*["']([^"']+)["']/i);
        if (match && match[1]) {
            console.log("[extractVideoUrl] 从DPlayer配置提取到URL");
            return { videoUrl: match[1], quality: "", type: match[1].includes('.m3u8') ? 'hls' : 'mp4' };
        }
        
        // 方法5: 尝试匹配 url: "xxx" 格式
        match = html.match(/url\s*:\s*["']([^"']*\.(?:m3u8|mp4)[^"']*)["']/i);
        if (match && match[1]) {
            console.log("[extractVideoUrl] 从url配置提取到URL");
            return { videoUrl: match[1], quality: "", type: match[1].includes('.m3u8') ? 'hls' : 'mp4' };
        }
        
        // 方法6: 尝试提取m3u8链接
        match = html.match(/["']([^"']*\.m3u8[^"']*)["']/i);
        if (match && match[1]) {
            console.log("[extractVideoUrl] 提取到m3u8链接");
            const videoUrl = match[1].replace(/\\\//g, '/');
            return { videoUrl: videoUrl, quality: "", type: "hls" };
        }
        
        // 方法7: 查找所有可能的视频URL
        const videoPatterns = [
            /https?:\/\/[^"'\s<>\\]+\.m3u8[^"'\s<>\\]*/gi,
            /https?:\/\/[^"'\s<>\\]+\.mp4[^"'\s<>\\]*/gi
        ];
        
        for (const pattern of videoPatterns) {
            const matches = html.match(pattern);
            if (matches && matches.length > 0) {
                const validUrl = matches.find(url => 
                    !url.includes('thumbnail') && 
                    !url.includes('poster') && 
                    !url.includes('preview')
                );
                if (validUrl) {
                    console.log("[extractVideoUrl] 从正则匹配提取到URL");
                    const videoUrl = validUrl.replace(/\\\//g, '/');
                    return { videoUrl: videoUrl, quality: "", type: videoUrl.includes('.m3u8') ? 'hls' : 'mp4' };
                }
            }
        }
        
        console.log("[extractVideoUrl] 未找到视频URL");
        return null;
    } catch (error) {
        console.log("[extractVideoUrl] 提取视频链接失败:", error.message);
        return null;
    }
}

// 提取推荐视频
function extractRecommendedVideos(html, maxCount = 10) {
    const $ = Widget.html.load(html);
    const result = [];
    
    // 推荐视频区域选择器
    const recommendSelectors = [
        ".related-posts article",
        ".recommend article",
        ".sidebar article",
        "article[itemscope]"
    ];
    
    let found = false;
    for (const selector of recommendSelectors) {
        const items = $(selector);
        if (items.length > 0 && !found) {
            items.slice(0, maxCount).each(function () {
                const videoInfo = extractVideoInfo($, this);
                if (videoInfo) {
                    result.push(videoInfo);
                }
            });
            if (result.length > 0) found = true;
        }
    }
    
    return result;
}

// 加载视频详情
async function loadDetail(link) {
    try {
        console.log(`[loadDetail] 开始加载: ${link}`);
        
        // 确保链接是完整的
        const fullUrl = ensureAbsoluteUrl(link);
        
        // 从链接中提取视频ID
        const idMatch = link.match(/\/archives\/(\d+)/);
        const videoId = idMatch ? idMatch[1] : link;
        
        // 获取详情页HTML
        const response = await Widget.http.get(fullUrl, { headers: HEADERS });
        
        if (!response || !response.data) {
            throw new Error("详情页加载失败");
        }
        
        const html = response.data;
        
        // 提取视频播放链接
        const videoData = extractVideoUrl(html);
        
        if (!videoData || !videoData.videoUrl) {
            console.log("[loadDetail] 页面HTML片段:", html.substring(0, 2000));
            throw new Error("无法获取视频播放链接，请检查页面结构");
        }
        
        // 确保视频URL是完整的
        let videoUrl = videoData.videoUrl;
        if (!videoUrl.startsWith("http")) {
            videoUrl = ensureAbsoluteUrl(videoUrl);
        }
        
        // 提取推荐视频
        const recommendedVideos = extractRecommendedVideos(html, 10);
        
        // 提取视频标题
        const $ = Widget.html.load(html);
        const title = $("h1.post-title").text().trim() ||
                      $("h1").first().text().trim() ||
                      $("title").text().trim() ||
                      "视频播放";
        
        // 返回详情对象
        const result = {
            id: videoId,
            type: "detail",
            mediaType: "movie",
            title: title,
            videoUrl: videoUrl,
            quality: videoData.quality || "",
            customHeaders: {
                "Referer": fullUrl,
                "User-Agent": HEADERS["User-Agent"]
            },
            description: "",
            childItems: recommendedVideos
        };
        
        console.log(`[loadDetail] 加载成功: ${videoId}, 视频URL: ${videoUrl}`);
        return result;
        
    } catch (error) {
        console.error("[loadDetail] 错误:", error.message);
        throw error;
    }
}

// ==================== 模块导出 ====================
module.exports = {
    metadata: WidgetMetadata,
    getLatestVideos: getLatestVideos,
    getCategoryVideos: getCategoryVideos,
    loadDetail: loadDetail
};
