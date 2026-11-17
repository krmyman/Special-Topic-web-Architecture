/*
 * AI integration seam: set services.qwen.endpoint and services.macbert.endpoint
 * when a same-origin backend is available. Keep API keys on that backend.
 * The current prototype deliberately runs a local demo adapter only.
 */
const AI_CONFIG = Object.freeze({
  qwen: { endpoint: '', model: 'Qwen 3.5 9B' },
  macbert: { endpoint: '', model: 'MacBERT' },
});

const localeNames = { 'zh-Hant': '繁體中文', en: 'English', ja: '日本語', ko: '한국어' };
const fontSizeScales = { small: '.9', medium: '1', large: '1.15' };
const translations = {
  en: {
    '探索': 'Explore', '首頁': 'Home', '人氣排行': 'Popular', '飲品消息': 'Tea & News', '附近店家': 'Nearby', '風味關係': 'Flavor Map', '回饋': 'Feedback', '對話內容': 'Chat messages', '可互動的飲品風味關係圖': 'Interactive drink flavor map', '頁面風格': 'Appearance',
    '主要導覽': 'Main navigation', '茶感首頁': 'Tea Sense home', '今天喝什麼？': 'What sounds good today?', '告訴我們你的心情': 'Tell us how you feel', '訪客模式': 'Guest mode', '個人化設定': 'Personalize',
    '偏好設定': 'Preferences', '開啟選單': 'Open menu', 'YOUR DAILY CUP': 'YOUR DAILY CUP', '找到今天的': 'Find today’s ', '好味道': 'good taste', '說說你的心情，讓我們一起找杯剛剛好的飲料。': 'Tell us how you feel and we’ll find a drink that fits.',
    '今天想喝點什麼？': 'What would you like to drink today?', '說說你的心情，讓茶感幫你找一杯剛剛好的飲料。': 'Tell Tea Sense how you feel and we’ll find a drink that fits.', '告訴茶感你現在想喝什麼…': 'Tell Tea Sense what you feel like drinking…', '開啟飲品偏好': 'Open drink preferences', 'Qwen · 示範模式': 'Qwen · Demo mode', 'MacBERT 語意理解預留 · 尚未連線模型服務': 'MacBERT understanding reserved · Model service not connected', '目前天氣': 'Current weather', '允許定位後顯示目前天氣': 'Allow location to see current weather', '正在取得天氣…': 'Getting current weather…', '需要定位權限才能取得天氣': 'Location permission is needed for weather', '目前無法取得天氣資料': 'Weather data is currently unavailable', '晴朗': 'Clear', '大致晴朗': 'Mostly clear', '局部多雲': 'Partly cloudy', '陰天': 'Overcast', '有霧': 'Fog', '毛毛雨': 'Drizzle', '下雨': 'Rain', '短暫陣雨': 'Rain showers', '降雪': 'Snow', '雷雨': 'Thunderstorm', '濕度': 'Humidity', '午後微暖': 'Warm afternoon', '適合來點清爽的': 'Perfect for something refreshing', '授權後讀取一次位置以取得天氣；座標會傳送至 Open-Meteo。': 'With permission, location is read once for weather. Coordinates are sent to Open-Meteo.', '首頁載入時會詢問位置權限，用於附近探索': 'Location permission is requested when the homepage opens to help explore nearby.', '茶感小助手': 'Tea Sense Assistant', '隨時為你找靈感': 'Here to inspire your next sip', '清除對話': 'Clear chat',
    '現在': 'Now', '嗨！今天想喝點什麼呢？可以告訴我你的心情、口味，或是想避開的食材。': 'Hi! What are you in the mood for? Tell me a flavor you like, how you feel, or an ingredient to avoid.', '今日靈感': 'Today’s pick', '桂花烏龍鮮奶茶': 'Osmanthus Oolong Milk Tea', '茶香溫潤 · 微糖少冰': 'Fragrant and mellow · Less sugar, light ice',
    '快速需求': 'Quick prompts', '今天有點累，想喝清爽的': 'I feel tired; recommend something refreshing', '推薦低熱量的飲料': 'Recommend a low-calorie drink', '我今天心情不錯，想喝茶': 'I’m in a good mood and would like tea', '無咖啡因又不太甜的飲料': 'A caffeine-free drink that is not too sweet', '想喝清爽的': 'Something refreshing', '低熱量': 'Low calorie', '好心情': 'Good mood', '輸入飲品需求': 'Enter your drink preferences', '輸入你的飲品需求…': 'Tell us what you feel like drinking…', '送出訊息': 'Send message', '試試看：': 'Try: ', '無咖啡因又不太甜': 'Caffeine-free and not too sweet', '你的偏好只用來推薦': 'Your preferences are only used for recommendations',
    '今天的偏好': 'Your preferences', '調整條件，讓推薦更貼近你。': 'Fine-tune your preferences for better suggestions.', '熱量': 'Calories', '不限': 'Any', '不限茶種': 'Any tea', '咖啡因': 'Caffeine', '飲料配料': 'Toppings', '珍珠、椰果': 'Boba, coconut jelly', '珍珠': 'Boba', '椰果': 'Coconut jelly', '仙草': 'Grass jelly', '不加配料': 'No toppings', '心情': 'Mood', '選擇你的心情': 'Choose your mood', '放鬆': 'Relax', '想放鬆': 'Relax', '提振精神': 'Energy boost', '開心': 'Happy', '心情愉快': 'Feeling good', '茶種': 'Tea type', '烏龍茶': 'Oolong', '紅茶': 'Black tea', '綠茶': 'Green tea', '花草茶': 'Herbal tea', '過敏原': 'Allergens', '尚未設定': 'Not set', '乳製品': 'Dairy', '堅果': 'Nuts', '蜂蜜': 'Honey', '大豆': 'Soy', '低於 150 大卡': 'Under 150 kcal', '低於 300 大卡': 'Under 300 kcal', '低咖啡因': 'Low caffeine', '無咖啡因': 'Caffeine-free', '套用偏好': 'Apply preferences',
    '慢慢選，總會找到喜歡的那一杯。': 'Take your time. Your next favorite is out there.', '大家都在喝': 'What everyone’s ', '什麼': 'drinking', '看看最近最受歡迎的飲品，找一杯你的下一個喜歡。': 'Explore popular drinks and find your next favorite.', '↻ 更新排行': '↻ Refresh ranking', '↻ 更新中': '↻ Updating', 'POPULAR THIS WEEK': 'POPULAR THIS WEEK', '本週人氣': 'THIS WEEK', '人氣冠軍': 'Most loved', '清爽推薦': 'Refreshing', '經典不敗': 'Classic', '果香系': 'Fruity', '酸甜平衡': 'Sweet & tart', '無奶推薦': 'Dairy-free pick', '療癒系': 'Comforting', '酸甜果茶': 'Sweet & tart tea', '暖心推薦': 'Warming',
    '四季春青茶': 'Four Seasons Green Tea', '黑糖珍珠鮮奶': 'Brown Sugar Boba Milk', '柚香翡翠': 'Yuzu Jade Tea', '冬瓜檸檬': 'Winter Melon Lemon Tea', '蜜香紅茶': 'Honey Aroma Black Tea', '芋泥波波鮮奶': 'Taro Boba Milk', '百香雙響炮': 'Passion Fruit Double Topping Tea', '桂圓紅棗茶': 'Longan Jujube Tea', '花香烏龍 · 溫潤奶香': 'Floral oolong · Creamy and mellow', '清新回甘 · 無負擔': 'Clean finish · Light and easy', '濃郁黑糖 · Q 彈珍珠': 'Rich brown sugar · Chewy boba', '柚子果香 · 茶韻清甜': 'Yuzu citrus · Light tea notes', '古早冬瓜 · 清新檸檬': 'Traditional winter melon · Fresh lemon', '天然蜜韻 · 純茶首選': 'Natural honey notes · Pure tea', '綿密芋泥 · 鮮乳香醇': 'Creamy taro · Fresh milk', '百香果香 · 雙料口感': 'Passion fruit · Two toppings', '桂圓棗香 · 暖心熱飲': 'Longan and jujube · A warming cup',
    '飲品': 'Tea & drinks', '新鮮事': 'Fresh finds', '新品、店家消息與茶飲靈感，最近都在這裡。': 'New drinks, shop news, and tea inspiration—all here.', '桂花季來了，秋天的茶香正好': 'Osmanthus season is here: a perfect autumn tea', '從窨製烏龍到桂花蜜飲，認識這個季節最迷人的花香滋味。': 'From scented oolong to osmanthus tea, explore the floral flavors of the season.', '茶感編輯室 · 風味專題': 'Tea Sense Editorial · Flavor story', '手炒黑糖的新喝法：搭配清焙烏龍': 'A new take on brown sugar with lightly roasted oolong', '濃郁黑糖與焙火茶韻相遇，甜而不膩的新組合值得一試。': 'Rich brown sugar meets roasted tea for a sweet, balanced pairing.', '飲品情報 · 新品觀察': 'Drink notes · New on the menu', '午後想少一點咖啡因，可以怎麼選？': 'How to choose a lower-caffeine afternoon tea', '認識花草茶與低咖啡因茶飲，為午後留一點剛好的清醒。': 'Discover herbal and low-caffeine teas for a gentle afternoon lift.', '茶感編輯室 · 日常茶知識': 'Tea Sense Editorial · Tea basics', '巷子裡的製茶小店，把茶做得很日常': 'A neighborhood tea shop makes tea part of everyday life', '從產地到手沖，用一杯茶認識小店的風味故事。': 'Discover a local shop’s tea story, from origin to pour.', '街角散步 · 店家故事': 'Around the corner · Shop story', '展示用文章為原型內容；正式上線時請串接授權的新聞與店家來源。': 'Sample articles for this prototype. Connect licensed news and shop sources before launch.',
    '巷口的': 'Around the corner,', '好茶': 'good tea', '找到附近值得停下來的飲料店。': 'Find a nearby shop worth stopping for.', '附近飲料店': 'Nearby tea shops', '使用目前位置探索周邊': 'Use your location to explore nearby', '⌖ 使用目前位置': '⌖ Use my location', '示意街區地圖': 'Illustrative neighborhood map', '青禾茶室': 'Green Grain Tea Room', '山日子茶飲': 'Mountain Day Tea', '小島製茶': 'Island Tea Works', '示意地圖': 'Illustrative map', '店家位置目前為示意資料。定位需在 HTTPS 或 localhost 下由你明確授權。': 'Shop locations are illustrative. Location access requires your permission on HTTPS or localhost.', '附近推薦': 'Nearby picks', 'CURATED NEARBY': 'CURATED NEARBY', '手沖茶飲 · 烏龍專門': 'Hand-brewed tea · Oolong specialist', '鮮奶茶 · 自家烘焙': 'Milk tea · House-roasted tea', '台灣茶 · 季節限定': 'Taiwanese tea · Seasonal picks', '⌖ 尋找我的位置': '⌖ Find my location',
    '風味彼此': 'Where flavors', '相遇': 'meet', '看看茶種、配料和風味之間，有哪些有趣的連結。': 'Explore connections between tea, toppings, and flavor.', '風味關係圖': 'Flavor map', '選一個節點看看相關風味': 'Select a node to explore related flavors', '風味': 'Flavor', '配料': 'Toppings', '烏龍茶': 'Oolong', '清香': 'Fresh aroma', '焙火': 'Roasted', '茶韻': 'Tea notes', '桂花': 'Osmanthus', '奶香': 'Milky', '鮮奶': 'Fresh milk', '柑橘': 'Citrus', '花香': 'Floral', '焦糖': 'Caramel', '木質': 'Woody', '香氣': 'Aroma', '回甘': 'Sweet finish', '點選圖上的圓點，探索風味關聯。': 'Select a node to explore flavor connections.', '目前關係圖為可互動的示意資料，可替換為 RelGT 模型輸出。': 'Interactive sample data. This graph can later use RelGT model output.',
    'WE’D LOVE TO HEAR': 'WE’D LOVE TO HEAR', '讓茶感更好一點': 'Help us make Tea Sense better', '遇到問題、想推薦飲料，或有任何想法都歡迎告訴我們。': 'Report an issue, recommend a drink, or share an idea.', '回饋類型': 'Feedback type', '推薦不符合期待': 'Recommendation missed the mark', '回報錯誤': 'Report a problem', '分享飲品或店家': 'Share a drink or shop', '其他想法': 'Other idea', '回饋內容': 'Your feedback', '寫下你的想法…': 'Tell us what you think…', '提供回饋': 'Send feedback', '送出回饋': 'Submit feedback', '關閉': 'Close', 'YOUR SETTINGS': 'YOUR SETTINGS', '個人化設定': 'Personalize', '選擇你偏好的使用方式。': 'Choose how you’d like to use Tea Sense.', '語言': 'Language', '繁體中文': 'Traditional Chinese', '暖白茶室': 'Warm tea room', '夜間茶席': 'Evening tea room', '字體大小': 'Text size', '小字體': 'Small', '中字體': 'Medium', '大字體': 'Large', '版本 v6.0.0': 'Version v6.0.0', '儲存設定': 'Save settings', '正在為你找靈感': 'Finding inspiration for you', '整理口味偏好，挑選合適的飲品…': 'Considering your preferences and finding a drink…',
    '你 · 現在': 'You · Now', '茶感小助手 · 現在': 'Tea Sense Assistant · Now', '對話已重置。今天想從什麼口味開始？': 'Chat cleared. What flavors are you in the mood for?',
    '可以試試洛神花茶或桂花蜜香紅茶，茶香柔和又不含咖啡因。記得確認店家的實際配方與過敏原標示喔。': 'Try hibiscus tea or osmanthus honey black tea for a gentle, caffeine-free sip. Check the shop’s ingredients and allergen information.', '推薦無糖青茶或冷泡烏龍，清爽簡單。每家店的配方和熱量不同，點餐前可以再向店家確認。': 'Try unsweetened green tea or cold-brew oolong. Recipes and calories vary by shop, so please check before ordering.', '想清爽一點的話，試試四季春青茶加一點檸檬，微糖少冰也很適合午後。': 'For something refreshing, try Four Seasons green tea with lemon, lightly sweetened and with less ice.', '一杯桂花烏龍鮮奶茶很適合好心情：烏龍茶香搭配淡淡花香，建議微糖少冰。': 'Osmanthus oolong milk tea is a lovely match for a good mood: fragrant tea with floral notes, lightly sweetened and with less ice.', '收到！依照你的想法，我會先從清爽茶飲開始找。你也可以告訴我想要的甜度、茶種，或需要避開的食材。': 'Got it! I’ll start with refreshing teas. You can also tell me your preferred sweetness, tea type, or ingredients to avoid.', '我找到一些飲品方向，告訴我更多偏好就能幫你縮小選擇。': 'I have a few ideas. Share more preferences and I can narrow them down.', '目前暫時無法連線到推薦服務，請稍後再試。你仍可使用偏好選擇與其他展示頁面。': 'The recommendation service is temporarily unavailable. Please try again later; preferences and other pages are still available.', '↻ 更新排行': '↻ Refresh ranking', '↻ 更新中': '↻ Updating', '已更新展示排行': 'Sample ranking refreshed', '對話已重置': 'Chat cleared', '已清除偏好條件': 'Preferences cleared', '回饋已在本機示範送出；正式版需設定接收服務': 'Feedback submitted in this demo; a live version needs a receiving service', '設定已套用': 'Settings applied', '已套用 {count} 項偏好': 'Applied {count} preferences',
    '此瀏覽器不支援定位，顯示示意店家': 'Geolocation is not supported. Showing sample shops.', '瀏覽器目前不支援定位': 'Your browser does not support geolocation.', '正在取得位置…': 'Getting your location…', '已取得位置 {lat}, {lon}；店家仍為示意資料': 'Location found: {lat}, {lon}. Shop data is still illustrative.', '定位成功；串接地圖資料後即可搜尋附近店家': 'Location found. Connect map data to search for nearby shops.', '你尚未授權定位，顯示示意店家': 'Location permission was not granted. Showing sample shops.', '目前無法取得位置，顯示示意店家': 'Could not get your location. Showing sample shops.', '定位逾時，顯示示意店家': 'Location request timed out. Showing sample shops.', '定位失敗，顯示示意店家': 'Could not get your location. Showing sample shops.', '未能取得位置，仍可瀏覽示意店家': 'Location unavailable. You can still browse sample shops.', '已選取風味節點': 'Selected flavor node', '正式版本可由 RelGT 模型提供關聯強度與推薦說明。': 'A production RelGT model can provide relationship strength and recommendations.',
    '以聊天探索符合口味與需求的飲品，查看人氣推薦、消息與附近店家。': 'Explore drinks by chat, browse popular picks and news, and find nearby shops.', '茶感 Tea Sense｜飲品探索': 'Tea Sense | Drink discovery', 'HOME': 'HOME',
  },
  ja: {
    '探索': '探索', '首頁': 'ホーム', '人氣排行': '人気ランキング', '飲品消息': 'ドリンクニュース', '附近店家': '近くのお店', '風味關係': '風味マップ', '回饋': 'フィードバック', '對話內容': 'チャットメッセージ', '可互動的飲品風味關係圖': 'ドリンク風味のインタラクティブマップ', '頁面風格': 'テーマ',
    '主要導覽': 'メインナビゲーション', '茶感首頁': '茶感ホーム', '今天喝什麼？': '今日は何を飲もう？', '告訴我們你的心情': '今の気分を教えてください', '訪客模式': 'ゲストモード', '個人化設定': '設定',
    '偏好設定': '設定', '開啟選單': 'メニューを開く', 'YOUR DAILY CUP': '今日の一杯', '找到今天的': '今日の', '好味道': 'お気に入りを見つけよう', '說說你的心情，讓我們一起找杯剛剛好的飲料。': '気分を教えてください。ぴったりの一杯を一緒に探しましょう。',
    '午後微暖': '午後は穏やか', '今天想喝點什麼？': '今日は何を飲みたいですか？', '說說你的心情，讓茶感幫你找一杯剛剛好的飲料。': '気分を教えてください。Tea Senseがぴったりの一杯を探します。', '告訴茶感你現在想喝什麼…': '今飲みたいものをTea Senseに教えてください…', '開啟飲品偏好': 'ドリンクの好みを開く', 'Qwen · 示範模式': 'Qwen · デモモード', 'MacBERT 語意理解預留 · 尚未連線模型服務': 'MacBERT理解機能を準備中 · モデル未接続', '目前天氣': '現在の天気', '允許定位後顯示目前天氣': '位置情報を許可すると現在の天気を表示します', '正在取得天氣…': '現在の天気を取得中…', '需要定位權限才能取得天氣': '天気の取得には位置情報の許可が必要です', '目前無法取得天氣資料': '現在、天気データを取得できません', '晴朗': '晴れ', '大致晴朗': 'おおむね晴れ', '局部多雲': '晴れ時々くもり', '陰天': 'くもり', '有霧': '霧', '毛毛雨': '霧雨', '下雨': '雨', '短暫陣雨': 'にわか雨', '降雪': '雪', '雷雨': '雷雨', '濕度': '湿度', '適合來點清爽的': 'さっぱりした一杯にぴったり', '授權後讀取一次位置以取得天氣；座標會傳送至 Open-Meteo。': '許可後、天気取得のため位置情報を一度読み取ります。座標はOpen-Meteoに送信されます。', '首頁載入時會詢問位置權限，用於附近探索': 'ホームの読み込み時に、近くを探すため位置情報の許可を確認します。', '茶感小助手': 'Tea Sense アシスタント', '隨時為你找靈感': '次の一杯をご提案します', '清除對話': '会話をクリア',
    '現在': '今', '嗨！今天想喝點什麼呢？可以告訴我你的心情、口味，或是想避開的食材。': 'こんにちは！今日は何を飲みたいですか？気分や好み、避けたい食材を教えてください。', '今日靈感': '今日のおすすめ', '桂花烏龍鮮奶茶': '桂花ウーロンミルクティー', '茶香溫潤 · 微糖少冰': 'まろやかな茶の香り · 甘さ控えめ・氷少なめ',
    '快速需求': 'クイックリクエスト', '今天有點累，想喝清爽的': '少し疲れたので、さっぱりしたものが飲みたい', '推薦低熱量的飲料': '低カロリーの飲み物をおすすめして', '我今天心情不錯，想喝茶': '今日は気分がいいので、お茶が飲みたい', '無咖啡因又不太甜的飲料': 'カフェイン控えめで甘さ控えめの飲み物', '想喝清爽的': 'さっぱりしたもの', '低熱量': '低カロリー', '好心情': '気分よく', '輸入飲品需求': '飲み物の希望を入力', '輸入你的飲品需求…': '飲みたいものを入力してください…', '送出訊息': 'メッセージを送信', '試試看：': 'おすすめ：', '無咖啡因又不太甜': 'カフェイン控えめで甘さ控えめ', '你的偏好只用來推薦': '設定はおすすめのためだけに使用します',
    '今天的偏好': '今日の好み', '調整條件，讓推薦更貼近你。': '好みを選んで、ぴったりの提案に。', '熱量': 'カロリー', '不限': '指定なし', '不限茶種': '茶種指定なし', '咖啡因': 'カフェイン', '飲料配料': 'トッピング', '珍珠、椰果': 'タピオカ、ナタデココ', '珍珠': 'タピオカ', '椰果': 'ナタデココ', '仙草': '仙草ゼリー', '不加配料': 'トッピングなし', '心情': '気分', '選擇你的心情': '気分を選択', '放鬆': 'リラックス', '想放鬆': 'リラックスしたい', '提振精神': '元気を出したい', '開心': '楽しい', '心情愉快': '気分がいい', '茶種': '茶種', '烏龍茶': 'ウーロン茶', '紅茶': '紅茶', '綠茶': '緑茶', '花草茶': 'ハーブティー', '過敏原': 'アレルゲン', '尚未設定': '未設定', '乳製品': '乳製品', '堅果': 'ナッツ', '蜂蜜': 'はちみつ', '大豆': '大豆', '低於 150 大卡': '150 kcal 未満', '低於 300 大卡': '300 kcal 未満', '低咖啡因': 'カフェイン控えめ', '無咖啡因': 'カフェインなし', '套用偏好': '好みを適用',
    '慢慢選，總會找到喜歡的那一杯。': 'ゆっくり選べば、きっと好きな一杯が見つかります。', '大家都在喝': 'みんなが飲んでいる', '什麼': 'ドリンク', '看看最近最受歡迎的飲品，找一杯你的下一個喜歡。': '人気のドリンクから、次のお気に入りを見つけましょう。', '↻ 更新排行': '↻ ランキング更新', '↻ 更新中': '↻ 更新中', 'POPULAR THIS WEEK': '今週の人気', '本週人氣': '今週の人気', '人氣冠軍': '人気No.1', '清爽推薦': 'さっぱり系', '經典不敗': '定番', '果香系': 'フルーティー', '酸甜平衡': '甘酸っぱい', '無奶推薦': 'ミルク不使用', '療癒系': '癒やし系', '酸甜果茶': '甘酸っぱいフルーツティー', '暖心推薦': 'ほっとする一杯',
    '四季春青茶': '四季春茶', '黑糖珍珠鮮奶': '黒糖タピオカミルク', '柚香翡翠': '柚子翡翠茶', '冬瓜檸檬': '冬瓜レモンティー', '蜜香紅茶': '蜜香紅茶', '芋泥波波鮮奶': 'タロイモタピオカミルク', '百香雙響炮': 'パッションフルーツダブルトッピング', '桂圓紅棗茶': 'リュウガンとナツメのお茶', '花香烏龍 · 溫潤奶香': '花香るウーロン · まろやかなミルク', '清新回甘 · 無負擔': 'すっきりした後味 · 軽やか', '濃郁黑糖 · Q 彈珍珠': '濃厚黒糖 · もちもちタピオカ', '柚子果香 · 茶韻清甜': '柚子の香り · すっきりしたお茶', '古早冬瓜 · 清新檸檬': '昔ながらの冬瓜 · さわやかなレモン', '天然蜜韻 · 純茶首選': '自然な蜂蜜の香り · ストレートティー', '綿密芋泥 · 鮮乳香醇': 'なめらかタロイモ · 濃厚ミルク', '百香果香 · 雙料口感': 'パッションフルーツ · 2種のトッピング', '桂圓棗香 · 暖心熱飲': 'リュウガンとナツメ · 温かい一杯',
    '飲品': 'ドリンク', '新鮮事': '新着情報', '新品、店家消息與茶飲靈感，最近都在這裡。': '新商品やお店の話題、お茶のアイデアをお届けします。', '桂花季來了，秋天的茶香正好': '金木犀の季節、秋のお茶を楽しもう', '從窨製烏龍到桂花蜜飲，認識這個季節最迷人的花香滋味。': '香り付けしたウーロンから桂花ハニーティーまで、季節の花の香りを楽しみましょう。', '茶感編輯室 · 風味專題': 'Tea Sense 編集部 · 風味特集', '手炒黑糖的新喝法：搭配清焙烏龍': '手作り黒糖と軽焙煎ウーロンの新しい組み合わせ', '濃郁黑糖與焙火茶韻相遇，甜而不膩的新組合值得一試。': '濃厚な黒糖と焙煎茶の香ばしさ。甘すぎない新しい組み合わせです。', '飲品情報 · 新品觀察': 'ドリンク情報 · 新商品', '午後想少一點咖啡因，可以怎麼選？': '午後のカフェインを控えたいときの選び方', '認識花草茶與低咖啡因茶飲，為午後留一點剛好的清醒。': 'ハーブティーや低カフェインのお茶で、午後にちょうどいい気分転換を。', '茶感編輯室 · 日常茶知識': 'Tea Sense 編集部 · お茶の基礎', '巷子裡的製茶小店，把茶做得很日常': '街角の小さなお茶屋さん、日常に寄り添う一杯', '從產地到手沖，用一杯茶認識小店的風味故事。': '産地からハンドドリップまで、一杯のお茶でお店の物語を。', '街角散步 · 店家故事': '街角さんぽ · お店の物語', '展示用文章為原型內容；正式上線時請串接授權的新聞與店家來源。': '記事はサンプルです。公開時は許諾を得たニュースや店舗情報を接続してください。',
    '巷口的': '近所の', '好茶': 'おいしいお茶', '找到附近值得停下來的飲料店。': '立ち寄りたくなる近くのお店を見つけましょう。', '附近飲料店': '近くのティーショップ', '使用目前位置探索周邊': '現在地から近くを探す', '⌖ 使用目前位置': '⌖ 現在地を使う', '示意街區地圖': '街のイメージマップ', '青禾茶室': '青禾茶房', '山日子茶飲': '山日子ティー', '小島製茶': '島茶製茶所', '示意地圖': 'イメージマップ', '店家位置目前為示意資料。定位需在 HTTPS 或 localhost 下由你明確授權。': '店舗の位置はサンプルです。位置情報はHTTPSまたはlocalhostで、許可した場合のみ使用します。', '附近推薦': '近くのおすすめ', 'CURATED NEARBY': '近くのお店', '手沖茶飲 · 烏龍專門': 'ハンドドリップ · ウーロン専門', '鮮奶茶 · 自家烘焙': 'ミルクティー · 自家焙煎茶', '台灣茶 · 季節限定': '台湾茶 · 季節限定', '⌖ 尋找我的位置': '⌖ 現在地を探す',
    '風味彼此': '風味が', '相遇': '出会う', '看看茶種、配料和風味之間，有哪些有趣的連結。': 'お茶やトッピング、風味のつながりを見てみましょう。', '風味關係圖': '風味マップ', '選一個節點看看相關風味': 'ノードを選んで関連する風味を見る', '風味': '風味', '配料': 'トッピング', '烏龍茶': 'ウーロン', '清香': 'さわやかな香り', '焙火': '焙煎香', '茶韻': 'お茶の余韻', '桂花': '金木犀', '奶香': 'ミルクの香り', '鮮奶': '生乳', '柑橘': '柑橘', '花香': '花の香り', '焦糖': 'キャラメル', '木質': 'ウッディ', '香氣': '香り', '回甘': '甘い余韻', '點選圖上的圓點，探索風味關聯。': 'ノードを選んで風味のつながりを探しましょう。', '目前關係圖為可互動的示意資料，可替換為 RelGT 模型輸出。': 'インタラクティブなサンプルです。将来RelGTモデルの出力に置き換えられます。',
    'WE’D LOVE TO HEAR': 'ご意見をお聞かせください', '讓茶感更好一點': 'Tea Senseをより良くするために', '遇到問題、想推薦飲料，或有任何想法都歡迎告訴我們。': '問題の報告、おすすめのドリンク、アイデアをお待ちしています。', '回饋類型': 'ご意見の種類', '推薦不符合期待': 'おすすめが合わなかった', '回報錯誤': '問題を報告', '分享飲品或店家': 'ドリンクやお店を紹介', '其他想法': 'その他', '回饋內容': 'ご意見の内容', '寫下你的想法…': 'ご意見を入力してください…', '提供回饋': 'フィードバック', '送出回饋': '送信', '關閉': '閉じる', 'YOUR SETTINGS': '設定', '個人化設定': '設定', '選擇你偏好的使用方式。': '利用方法を選んでください。', '語言': '言語', '繁體中文': '繁体字中国語', '暖白茶室': '温かな茶室', '夜間茶席': '夜の茶席', '字體大小': '文字サイズ', '小字體': '小', '中字體': '中', '大字體': '大', '版本 v6.0.0': 'バージョン v6.0.0', '儲存設定': '設定を保存', '正在為你找靈感': 'おすすめを探しています', '整理口味偏好，挑選合適的飲品…': '好みをもとにドリンクを探しています…',
    '你 · 現在': 'あなた · 今', '茶感小助手 · 現在': 'Tea Sense アシスタント · 今', '對話已重置。今天想從什麼口味開始？': '会話をクリアしました。どんな味から始めますか？',
    '可以試試洛神花茶或桂花蜜香紅茶，茶香柔和又不含咖啡因。記得確認店家的實際配方與過敏原標示喔。': 'ハイビスカスティーや桂花ハニーティーはいかがですか。カフェインは含まれません。お店の原材料とアレルギー表示をご確認ください。', '推薦無糖青茶或冷泡烏龍，清爽簡單。每家店的配方和熱量不同，點餐前可以再向店家確認。': '無糖の青茶や水出しウーロンがおすすめです。配合やカロリーはお店によって異なるため、注文前にご確認ください。', '想清爽一點的話，試試四季春青茶加一點檸檬，微糖少冰也很適合午後。': 'さっぱりしたいなら、四季春茶にレモンを少し。甘さ控えめ、氷少なめが午後にぴったりです。', '一杯桂花烏龍鮮奶茶很適合好心情：烏龍茶香搭配淡淡花香，建議微糖少冰。': '気分のいい日には桂花ウーロンミルクティーはいかがですか。甘さ控えめ、氷少なめがおすすめです。', '收到！依照你的想法，我會先從清爽茶飲開始找。你也可以告訴我想要的甜度、茶種，或需要避開的食材。': 'わかりました。まずはさっぱりしたお茶から探します。甘さや茶種、避けたい食材も教えてください。', '我找到一些飲品方向，告訴我更多偏好就能幫你縮小選擇。': 'いくつか候補があります。好みを教えていただければ、さらに絞り込めます。', '目前暫時無法連線到推薦服務，請稍後再試。你仍可使用偏好選擇與其他展示頁面。': '現在おすすめサービスに接続できません。しばらくしてから再度お試しください。他のページはご利用いただけます。', '↻ 更新排行': '↻ ランキング更新', '↻ 更新中': '↻ 更新中', '已更新展示排行': 'サンプルランキングを更新しました', '對話已重置': '会話をクリアしました', '已清除偏好條件': '好みの条件をクリアしました', '回饋已在本機示範送出；正式版需設定接收服務': 'サンプルとして送信しました。正式版には受信サービスの設定が必要です', '設定已套用': '設定を適用しました', '已套用 {count} 項偏好': '{count}件の好みを適用しました',
    '此瀏覽器不支援定位，顯示示意店家': 'このブラウザーは位置情報に対応していません。サンプル店舗を表示します。', '瀏覽器目前不支援定位': 'このブラウザーは位置情報に対応していません。', '正在取得位置…': '位置情報を取得しています…', '已取得位置 {lat}, {lon}；店家仍為示意資料': '位置を取得しました {lat}, {lon}。店舗はサンプルです。', '定位成功；串接地圖資料後即可搜尋附近店家': '位置を取得しました。地図データ接続後に近くのお店を検索できます。', '你尚未授權定位，顯示示意店家': '位置情報の許可がありません。サンプル店舗を表示します。', '目前無法取得位置，顯示示意店家': '現在地を取得できません。サンプル店舗を表示します。', '定位逾時，顯示示意店家': '位置情報の取得がタイムアウトしました。サンプル店舗を表示します。', '定位失敗，顯示示意店家': '位置情報を取得できません。サンプル店舗を表示します。', '未能取得位置，仍可瀏覽示意店家': '位置情報を利用できません。サンプル店舗をご覧いただけます。', '已選取風味節點': '風味ノードを選択しました', '正式版本可由 RelGT 模型提供關聯強度與推薦說明。': '正式版ではRelGTモデルが関連度とおすすめを提示できます。',
    '以聊天探索符合口味與需求的飲品，查看人氣推薦、消息與附近店家。': '会話で好みに合うドリンクを探し、人気商品やニュース、近くのお店をチェック。', '茶感 Tea Sense｜飲品探索': 'Tea Sense｜ドリンクを探す',
  },
  ko: {
    '探索': '둘러보기', '首頁': '홈', '人氣排行': '인기 순위', '飲品消息': '음료 소식', '附近店家': '주변 매장', '風味關係': '풍미 지도', '回饋': '의견', '對話內容': '대화 메시지', '可互動的飲品風味關係圖': '인터랙티브 음료 풍미 지도', '頁面風格': '테마',
    '主要導覽': '주요 메뉴', '茶感首頁': 'Tea Sense 홈', '今天喝什麼？': '오늘은 무엇을 마실까요?', '告訴我們你的心情': '오늘 기분을 알려주세요', '訪客模式': '게스트 모드', '個人化設定': '설정',
    '偏好設定': '설정', '開啟選單': '메뉴 열기', 'YOUR DAILY CUP': '오늘의 한 잔', '找到今天的': '오늘의', '好味道': '취향을 찾아보세요', '說說你的心情，讓我們一起找杯剛剛好的飲料。': '기분을 알려주시면 딱 맞는 음료를 함께 찾아볼게요.',
    '午後微暖': '따뜻한 오후', '今天想喝點什麼？': '오늘은 무엇을 마시고 싶으세요?', '說說你的心情，讓茶感幫你找一杯剛剛好的飲料。': '기분을 알려주시면 Tea Sense가 어울리는 음료를 찾아드릴게요.', '告訴茶感你現在想喝什麼…': '지금 마시고 싶은 음료를 Tea Sense에 알려주세요…', '開啟飲品偏好': '음료 취향 열기', 'Qwen · 示範模式': 'Qwen · 데모 모드', 'MacBERT 語意理解預留 · 尚未連線模型服務': 'MacBERT 의미 이해 준비 중 · 모델 미연결', '目前天氣': '현재 날씨', '允許定位後顯示目前天氣': '위치 정보에 동의하면 현재 날씨를 표시합니다', '正在取得天氣…': '현재 날씨를 가져오는 중…', '需要定位權限才能取得天氣': '날씨를 보려면 위치 권한이 필요합니다', '目前無法取得天氣資料': '현재 날씨 정보를 가져올 수 없습니다', '晴朗': '맑음', '大致晴朗': '대체로 맑음', '局部多雲': '구름 조금', '陰天': '흐림', '有霧': '안개', '毛毛雨': '이슬비', '下雨': '비', '短暫陣雨': '소나기', '降雪': '눈', '雷雨': '뇌우', '濕度': '습도', '適合來點清爽的': '상큼한 한 잔이 어울려요', '授權後讀取一次位置以取得天氣；座標會傳送至 Open-Meteo。': '동의하면 날씨 확인을 위해 위치를 한 번 읽습니다. 좌표는 Open-Meteo로 전송됩니다.', '首頁載入時會詢問位置權限，用於附近探索': '홈페이지를 열 때 주변 탐색을 위해 위치 권한을 요청합니다.', '茶感小助手': 'Tea Sense 도우미', '隨時為你找靈感': '다음 한 잔을 추천해 드려요', '清除對話': '대화 지우기',
    '現在': '지금', '嗨！今天想喝點什麼呢？可以告訴我你的心情、口味，或是想避開的食材。': '안녕하세요! 오늘은 어떤 음료가 좋으세요? 기분이나 좋아하는 맛, 피하고 싶은 재료를 알려주세요.', '今日靈感': '오늘의 추천', '桂花烏龍鮮奶茶': '계화 우롱 밀크티', '茶香溫潤 · 微糖少冰': '은은한 차 향 · 당도 낮게, 얼음 적게',
    '快速需求': '빠른 요청', '今天有點累，想喝清爽的': '조금 피곤해서 상큼한 음료를 마시고 싶어요', '推薦低熱量的飲料': '저칼로리 음료를 추천해 주세요', '我今天心情不錯，想喝茶': '오늘 기분이 좋아서 차를 마시고 싶어요', '無咖啡因又不太甜的飲料': '무카페인에 덜 단 음료', '想喝清爽的': '상큼한 음료', '低熱量': '저칼로리', '好心情': '기분 전환', '輸入飲品需求': '음료 취향 입력', '輸入你的飲品需求…': '원하는 음료를 입력하세요…', '送出訊息': '메시지 보내기', '試試看：': '이런 요청은 어때요: ', '無咖啡因又不太甜': '무카페인, 덜 달게', '你的偏好只用來推薦': '선호 정보는 추천에만 사용됩니다',
    '今天的偏好': '오늘의 취향', '調整條件，讓推薦更貼近你。': '취향을 조정해 더 잘 맞는 추천을 받아보세요.', '熱量': '칼로리', '不限': '상관없음', '不限茶種': '차 종류 상관없음', '咖啡因': '카페인', '飲料配料': '토핑', '珍珠、椰果': '펄, 코코넛 젤리', '珍珠': '펄', '椰果': '코코넛 젤리', '仙草': '선초 젤리', '不加配料': '토핑 제외', '心情': '기분', '選擇你的心情': '기분 선택', '放鬆': '휴식', '想放鬆': '편안하게', '提振精神': '기운 내기', '開心': '행복함', '心情愉快': '기분 좋음', '茶種': '차 종류', '烏龍茶': '우롱차', '紅茶': '홍차', '綠茶': '녹차', '花草茶': '허브차', '過敏原': '알레르기 유발 성분', '尚未設定': '설정 안 됨', '乳製品': '유제품', '堅果': '견과류', '蜂蜜': '꿀', '大豆': '대두', '低於 150 大卡': '150 kcal 미만', '低於 300 大卡': '300 kcal 미만', '低咖啡因': '저카페인', '無咖啡因': '무카페인', '套用偏好': '취향 적용',
    '慢慢選，總會找到喜歡的那一杯。': '천천히 골라보세요. 마음에 드는 한 잔을 찾을 수 있어요.', '大家都在喝': '요즘 인기 있는 ', '什麼': '음료', '看看最近最受歡迎的飲品，找一杯你的下一個喜歡。': '요즘 인기 음료를 살펴보고 다음 취향을 찾아보세요.', '↻ 更新排行': '↻ 순위 새로고침', '↻ 更新中': '↻ 업데이트 중', 'POPULAR THIS WEEK': '이번 주 인기', '本週人氣': '이번 주 인기', '人氣冠軍': '가장 인기', '清爽推薦': '상큼 추천', '經典不敗': '클래식', '果香系': '과일 향', '酸甜平衡': '새콤달콤', '無奶推薦': '유제품 제외', '療癒系': '힐링', '酸甜果茶': '새콤달콤 과일차', '暖心推薦': '따뜻한 추천',
    '四季春青茶': '사계춘 녹차', '黑糖珍珠鮮奶': '흑당 펄 밀크티', '柚香翡翠': '유자 비취차', '冬瓜檸檬': '동과 레몬티', '蜜香紅茶': '꿀향 홍차', '芋泥波波鮮奶': '타로 펄 밀크티', '百香雙響炮': '패션프루트 더블 토핑티', '桂圓紅棗茶': '용안 대추차', '花香烏龍 · 溫潤奶香': '꽃향 우롱 · 부드러운 우유 향', '清新回甘 · 無負擔': '깔끔한 뒷맛 · 가볍게', '濃郁黑糖 · Q 彈珍珠': '진한 흑당 · 쫄깃한 펄', '柚子果香 · 茶韻清甜': '유자 향 · 산뜻한 차 맛', '古早冬瓜 · 清新檸檬': '전통 동과 · 상큼한 레몬', '天然蜜韻 · 純茶首選': '자연스러운 꿀 향 · 기본 홍차', '綿密芋泥 · 鮮乳香醇': '부드러운 토란 · 고소한 우유', '百香果香 · 雙料口感': '패션프루트 · 두 가지 토핑', '桂圓棗香 · 暖心熱飲': '용안과 대추 · 따뜻한 차',
    '飲品': '음료', '新鮮事': '새로운 소식', '新品、店家消息與茶飲靈感，最近都在這裡。': '신메뉴와 매장 소식, 차에 관한 아이디어를 만나보세요.', '桂花季來了，秋天的茶香正好': '계화 시즌, 가을 차 향을 즐겨보세요', '從窨製烏龍到桂花蜜飲，認識這個季節最迷人的花香滋味。': '향을 입힌 우롱차부터 계화 꿀차까지, 계절의 꽃 향을 만나보세요.', '茶感編輯室 · 風味專題': 'Tea Sense 편집팀 · 풍미 이야기', '手炒黑糖的新喝法：搭配清焙烏龍': '수제 흑당과 가볍게 볶은 우롱의 새로운 조합', '濃郁黑糖與焙火茶韻相遇，甜而不膩的新組合值得一試。': '진한 흑당과 볶은 차 향이 만나 달콤하지만 부담스럽지 않아요.', '飲品情報 · 新品觀察': '음료 소식 · 신메뉴', '午後想少一點咖啡因，可以怎麼選？': '오후에 카페인을 줄이고 싶다면?', '認識花草茶與低咖啡因茶飲，為午後留一點剛好的清醒。': '허브차와 저카페인 차로 오후에 기분 좋은 활력을 더해보세요.', '茶感編輯室 · 日常茶知識': 'Tea Sense 편집팀 · 차 이야기', '巷子裡的製茶小店，把茶做得很日常': '골목의 작은 찻집, 일상에서 즐기는 차', '從產地到手沖，用一杯茶認識小店的風味故事。': '산지에서 핸드드립까지, 한 잔에 담긴 가게 이야기를 만나보세요.', '街角散步 · 店家故事': '골목 산책 · 매장 이야기', '展示用文章為原型內容；正式上線時請串接授權的新聞與店家來源。': '샘플 기사입니다. 정식 출시 전 승인된 뉴스와 매장 정보를 연결하세요.',
    '巷口的': '동네의', '好茶': '좋은 차', '找到附近值得停下來的飲料店。': '잠시 들르고 싶은 주변 음료 매장을 찾아보세요.', '附近飲料店': '주변 찻집', '使用目前位置探索周邊': '현재 위치로 주변 둘러보기', '⌖ 使用目前位置': '⌖ 현재 위치 사용', '示意街區地圖': '동네 예시 지도', '青禾茶室': '청하 티룸', '山日子茶飲': '산날 티', '小島製茶': '작은 섬 차공방', '示意地圖': '예시 지도', '店家位置目前為示意資料。定位需在 HTTPS 或 localhost 下由你明確授權。': '매장 위치는 예시입니다. 위치 정보는 HTTPS 또는 localhost에서 동의한 경우에만 사용합니다.', '附近推薦': '주변 추천', 'CURATED NEARBY': '엄선한 주변 매장', '手沖茶飲 · 烏龍專門': '핸드드립 차 · 우롱 전문', '鮮奶茶 · 自家烘焙': '밀크티 · 직접 로스팅한 차', '台灣茶 · 季節限定': '대만 차 · 계절 한정', '⌖ 尋找我的位置': '⌖ 내 위치 찾기',
    '風味彼此': '풍미가', '相遇': '만나는 곳', '看看茶種、配料和風味之間，有哪些有趣的連結。': '차와 토핑, 풍미 사이의 재미있는 연결을 살펴보세요.', '風味關係圖': '풍미 지도', '選一個節點看看相關風味': '노드를 선택해 관련 풍미를 확인하세요', '風味': '풍미', '配料': '토핑', '烏龍茶': '우롱차', '清香': '산뜻한 향', '焙火': '볶은 향', '茶韻': '차의 여운', '桂花': '계화', '奶香': '우유 향', '鮮奶': '생우유', '柑橘': '감귤', '花香': '꽃 향', '焦糖': '캐러멜', '木質': '우디', '香氣': '향기', '回甘': '달콤한 여운', '點選圖上的圓點，探索風味關聯。': '노드를 선택해 풍미의 연결을 살펴보세요.', '目前關係圖為可互動的示意資料，可替換為 RelGT 模型輸出。': '인터랙티브 예시입니다. 추후 RelGT 모델 결과로 대체할 수 있습니다.',
    'WE’D LOVE TO HEAR': '여러분의 의견을 들려주세요', '讓茶感更好一點': '더 나은 Tea Sense를 위해', '遇到問題、想推薦飲料，或有任何想法都歡迎告訴我們。': '문제 신고, 음료 추천, 아이디어를 보내주세요.', '回饋類型': '의견 유형', '推薦不符合期待': '추천이 마음에 들지 않아요', '回報錯誤': '문제 신고', '分享飲品或店家': '음료나 매장 소개', '其他想法': '기타 의견', '回饋內容': '의견 내용', '寫下你的想法…': '의견을 입력하세요…', '提供回饋': '의견 보내기', '送出回饋': '제출', '關閉': '닫기', 'YOUR SETTINGS': '설정', '個人化設定': '설정', '選擇你偏好的使用方式。': '원하는 사용 방식을 선택하세요.', '語言': '언어', '繁體中文': '중국어(번체)', '暖白茶室': '따뜻한 티룸', '夜間茶席': '저녁 티룸', '字體大小': '글자 크기', '小字體': '작게', '中字體': '보통', '大字體': '크게', '版本 v6.0.0': '버전 v6.0.0', '儲存設定': '설정 저장', '正在為你找靈感': '추천을 찾고 있어요', '整理口味偏好，挑選合適的飲品…': '취향을 바탕으로 음료를 찾는 중…',
    '你 · 現在': '나 · 지금', '茶感小助手 · 現在': 'Tea Sense 도우미 · 지금', '對話已重置。今天想從什麼口味開始？': '대화를 지웠어요. 어떤 맛부터 시작할까요?',
    '可以試試洛神花茶或桂花蜜香紅茶，茶香柔和又不含咖啡因。記得確認店家的實際配方與過敏原標示喔。': '히비스커스차나 계화 꿀 홍차를 추천해요. 카페인이 없고 향이 부드러워요. 매장의 재료와 알레르기 표시를 확인하세요.', '推薦無糖青茶或冷泡烏龍，清爽簡單。每家店的配方和熱量不同，點餐前可以再向店家確認。': '무가당 청차나 콜드브루 우롱을 추천해요. 매장마다 레시피와 칼로리가 다르니 주문 전에 확인해 주세요.', '想清爽一點的話，試試四季春青茶加一點檸檬，微糖少冰也很適合午後。': '상큼한 음료를 원한다면 사계춘차에 레몬을 더해보세요. 당도와 얼음을 적게 하면 오후에 잘 어울려요.', '一杯桂花烏龍鮮奶茶很適合好心情：烏龍茶香搭配淡淡花香，建議微糖少冰。': '기분 좋은 날엔 계화 우롱 밀크티를 추천해요. 은은한 꽃 향이 어우러져요. 당도와 얼음은 적게 드셔보세요.', '收到！依照你的想法，我會先從清爽茶飲開始找。你也可以告訴我想要的甜度、茶種，或需要避開的食材。': '좋아요! 우선 상큼한 차 음료부터 찾아볼게요. 원하는 당도와 차 종류, 피하고 싶은 재료도 알려주세요.', '我找到一些飲品方向，告訴我更多偏好就能幫你縮小選擇。': '몇 가지 음료를 찾았어요. 취향을 더 알려주시면 선택지를 좁혀볼게요.', '目前暫時無法連線到推薦服務，請稍後再試。你仍可使用偏好選擇與其他展示頁面。': '현재 추천 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요. 취향 선택과 다른 페이지는 이용할 수 있어요.', '↻ 更新排行': '↻ 순위 새로고침', '↻ 更新中': '↻ 업데이트 중', '已更新展示排行': '예시 순위를 업데이트했어요', '對話已重置': '대화를 지웠어요', '已清除偏好條件': '취향 조건을 지웠어요', '回饋已在本機示範送出；正式版需設定接收服務': '예시로 의견을 제출했어요. 정식 버전에는 수신 서비스가 필요합니다', '設定已套用': '설정을 적용했어요', '已套用 {count} 項偏好': '취향 {count}개를 적용했어요',
    '此瀏覽器不支援定位，顯示示意店家': '이 브라우저는 위치 정보를 지원하지 않습니다. 예시 매장을 표시합니다.', '瀏覽器目前不支援定位': '이 브라우저는 위치 정보를 지원하지 않습니다.', '正在取得位置…': '현재 위치를 확인 중…', '已取得位置 {lat}, {lon}；店家仍為示意資料': '위치를 확인했어요: {lat}, {lon}. 매장 정보는 예시입니다.', '定位成功；串接地圖資料後即可搜尋附近店家': '위치를 확인했어요. 지도 데이터를 연결하면 주변 매장을 검색할 수 있습니다.', '你尚未授權定位，顯示示意店家': '위치 권한이 없습니다. 예시 매장을 표시합니다.', '目前無法取得位置，顯示示意店家': '현재 위치를 확인할 수 없습니다. 예시 매장을 표시합니다.', '定位逾時，顯示示意店家': '위치 확인 시간이 초과되었습니다. 예시 매장을 표시합니다.', '定位失敗，顯示示意店家': '위치를 확인할 수 없습니다. 예시 매장을 표시합니다.', '未能取得位置，仍可瀏覽示意店家': '위치를 확인할 수 없습니다. 예시 매장은 볼 수 있어요.', '已選取風味節點': '풍미 노드를 선택했어요', '正式版本可由 RelGT 模型提供關聯強度與推薦說明。': '정식 버전에서는 RelGT 모델이 연관도와 추천 설명을 제공할 수 있습니다.',
    '以聊天探索符合口味與需求的飲品，查看人氣推薦、消息與附近店家。': '대화로 취향에 맞는 음료를 찾고 인기 메뉴, 소식, 주변 매장을 확인하세요.', '茶感 Tea Sense｜飲品探索': 'Tea Sense | 음료 찾기',
  },
};
translations.en['重試'] = 'Retry'; translations.ja['重試'] = '再試行'; translations.ko['重試'] = '다시 시도';
translations.en['品項'] = 'Drink'; translations.ja['品項'] = 'ドリンク'; translations.ko['品項'] = '음료'; translations.en['飲品比較'] = 'Compare drinks'; translations.ja['飲品比較'] = 'ドリンクを比較'; translations.ko['飲品比較'] = '음료 비교'; translations.en['未標示'] = 'Not listed'; translations.ja['未標示'] = '記載なし'; translations.ko['未標示'] = '표시 없음'; translations.en['移除'] = 'Remove'; translations.ja['移除'] = '削除'; translations.ko['移除'] = '삭제';
translations.en['茶飲'] = 'Tea'; translations.ja['茶飲'] = 'お茶'; translations.ko['茶飲'] = '차'; translations.en['不限'] = 'Any'; translations.ja['不限'] = '指定なし'; translations.ko['不限'] = '무관';
translations.en['重置對話'] = 'Reset chat'; translations.ja['重置對話'] = '会話をリセット'; translations.ko['重置對話'] = '대화 초기화';
translations.en['重新推薦'] = 'Regenerate'; translations.ja['重新推薦'] = '再提案'; translations.ko['重新推薦'] = '다시 추천';
translations.en['刪除'] = 'Delete'; translations.ja['刪除'] = '削除'; translations.ko['刪除'] = '삭제';
translations.en['飲品類別'] = 'Drink category'; translations.ja['飲品類別'] = 'ドリンクの種類'; translations.ko['飲品類別'] = '음료 종류';
translations.en['全部類別'] = 'All categories'; translations.ja['全部類別'] = 'すべて'; translations.ko['全部類別'] = '전체';
translations.en['純茶'] = 'Tea'; translations.ja['純茶'] = 'お茶'; translations.ko['純茶'] = '차'; translations.en['奶茶'] = 'Milk tea'; translations.ja['奶茶'] = 'ミルクティー'; translations.ko['奶茶'] = '밀크티'; translations.en['果茶'] = 'Fruit tea'; translations.ja['果茶'] = 'フルーツティー'; translations.ko['果茶'] = '과일차'; translations.en['其他'] = 'Other'; translations.ja['其他'] = 'その他'; translations.ko['其他'] = '기타';
translations.en['營業中'] = 'Open'; translations.ja['營業中'] = '営業中'; translations.ko['營業中'] = '영업 중'; translations.en['目前休息'] = 'Closed'; translations.ja['目前休息'] = '営業時間外'; translations.ko['目前休息'] = '영업 종료'; translations.en['沒有符合條件的示範店家'] = 'No sample shops match these filters'; translations.ja['沒有符合條件的示範店家'] = '条件に合うサンプル店舗はありません'; translations.ko['沒有符合條件的示範店家'] = '조건에 맞는 예시 매장이 없습니다';
translations.en['相關示範飲品'] = 'Related sample drinks'; translations.ja['相關示範飲品'] = '関連するおすすめ例'; translations.ko['相關示範飲品'] = '관련 예시 음료'; translations.en['風味推薦'] = 'flavor suggestion'; translations.ja['風味推薦'] = '風味のおすすめ'; translations.ko['風味推薦'] = '풍미 추천';
translations.en['示範資料未標示常見過敏原'] = 'No common allergens listed in this sample'; translations.ja['示範資料未標示常見過敏原'] = 'サンプルに一般的なアレルゲンの記載はありません'; translations.ko['示範資料未標示常見過敏原'] = '예시 데이터에 일반 알레르기 유발 성분이 표시되지 않았습니다';
translations.en['目前示範清單中沒有完全符合條件的品項，以下列出一般示範選項供參考。'] = 'No sample item matches all selected preferences; general examples are shown.'; translations.ja['目前示範清單中沒有完全符合條件的品項，以下列出一般示範選項供參考。'] = '条件に完全一致する例がないため、一般的な候補を表示します。'; translations.ko['目前示範清單中沒有完全符合條件的品項，以下列出一般示範選項供參考。'] = '선택한 조건에 맞는 예시가 없어 일반 예시를 표시합니다.';
translations.en['相關風味'] = 'Related flavors'; translations.ja['相關風味'] = '関連する風味'; translations.ko['相關風味'] = '관련 풍미'; translations.en['關聯為示範資料'] = 'These connections are illustrative.'; translations.ja['關聯為示範資料'] = '関連性はサンプルデータです。'; translations.ko['關聯為示範資料'] = '연결 정보는 예시 데이터입니다.';
translations.en['搜尋飲品'] = 'Search drinks'; translations.ja['搜尋飲品'] = 'ドリンクを検索'; translations.ko['搜尋飲品'] = '음료 검색';
translations.en['搜尋飲品名稱或風味…'] = 'Search drinks or flavors…'; translations.ja['搜尋飲品名稱或風味…'] = 'ドリンク名や風味を検索…'; translations.ko['搜尋飲品名稱或風味…'] = '음료 이름 또는 풍미 검색…';
translations.en['排序方式'] = 'Sort by'; translations.ja['排序方式'] = '並べ替え'; translations.ko['排序方式'] = '정렬 기준';
translations.en['人氣排序'] = 'Popularity'; translations.ja['人氣排序'] = '人気順'; translations.ko['人氣排序'] = '인기순';
translations.en['名稱排序'] = 'Name'; translations.ja['名稱排序'] = '名前順'; translations.ko['名稱排序'] = '이름순';
translations.en['花香、茶韻、奶香'] = 'Floral, tea, and milky notes'; translations.ja['花香、茶韻、奶香'] = '花の香り、茶の余韻、ミルクの風味'; translations.ko['花香、茶韻、奶香'] = '꽃향, 차의 여운, 우유 풍미';
translations.en['微糖少冰'] = 'Lightly sweet, less ice'; translations.ja['微糖少冰'] = '甘さ控えめ・氷少なめ'; translations.ko['微糖少冰'] = '당도 약하게, 얼음 적게';
translations.en['約 250–350 大卡'] = 'Approx. 250–350 kcal'; translations.ja['約 250–350 大卡'] = '約250～350 kcal'; translations.ko['約 250–350 大卡'] = '약 250~350 kcal';
translations.en['清香、清爽、回甘'] = 'Fresh, crisp, sweet finish'; translations.ja['清香、清爽、回甘'] = 'さわやかな香り、すっきり、甘い余韻'; translations.ko['清香、清爽、回甘'] = '산뜻한 향, 깔끔함, 단맛의 여운';
translations.en['無糖少冰'] = 'Unsweetened, less ice'; translations.ja['無糖少冰'] = '無糖・氷少なめ'; translations.ko['無糖少冰'] = '무가당, 얼음 적게';
translations.en['約 0–80 大卡'] = 'Approx. 0–80 kcal'; translations.ja['約 0–80 大卡'] = '約0～80 kcal'; translations.ko['約 0–80 大卡'] = '약 0~80 kcal';
translations.en['溫潤、果甜、暖香'] = 'Mellow, fruity sweetness, warming aroma'; translations.ja['溫潤、果甜、暖香'] = 'まろやか、果実の甘み、温かな香り'; translations.ko['溫潤、果甜、暖香'] = '부드럽고 과일 단맛, 따뜻한 향';
translations.en['建議無額外加糖'] = 'No extra sugar suggested'; translations.ja['建議無額外加糖'] = '砂糖を追加しないのがおすすめ'; translations.ko['建議無額外加糖'] = '추가 당류 없이 권장';
translations.en['依配方而異'] = 'Varies by recipe'; translations.ja['依配方而異'] = 'レシピによって異なります'; translations.ko['依配方而異'] = '레시피에 따라 다릅니다';
translations.en['可能含乳製品；依店家配方為準'] = 'May contain dairy; check the shop recipe'; translations.ja['可能含乳製品；依店家配方為準'] = '乳製品を含む場合があります。店舗のレシピをご確認ください'; translations.ko['可能含乳製品；依店家配方為準'] = '유제품이 포함될 수 있습니다. 매장 레시피를 확인하세요';
translations.en['通常不含乳；仍需確認店家資訊'] = 'Usually dairy-free; confirm with the shop'; translations.ja['通常不含乳；仍需確認店家資訊'] = '通常乳製品は含みませんが、店舗にご確認ください'; translations.ko['通常不含乳；仍需確認店家資訊'] = '일반적으로 유제품은 없지만 매장에 확인하세요';
translations.en['依店家配方確認'] = 'Check the shop recipe'; translations.ja['依店家配方確認'] = '店舗のレシピをご確認ください'; translations.ko['依店家配方確認'] = '매장 레시피를 확인하세요';
translations.en['示範推薦卡'] = 'Sample recommendation'; translations.ja['示範推薦卡'] = 'おすすめ例'; translations.ko['示範推薦卡'] = '예시 추천';
translations.en['風味：'] = 'Flavor: '; translations.ja['風味：'] = '風味：'; translations.ko['風味：'] = '풍미: '; translations.en['建議甜度'] = 'Suggested sweetness'; translations.ja['建議甜度'] = 'おすすめの甘さ'; translations.ko['建議甜度'] = '권장 당도'; translations.en['熱量：'] = 'Calories: '; translations.ja['熱量：'] = 'カロリー：'; translations.ko['熱量：'] = '열량: '; translations.en['含咖啡因'] = 'Contains caffeine'; translations.ja['含咖啡因'] = 'カフェインを含む'; translations.ko['含咖啡因'] = '카페인 포함'; translations.en['過敏原提醒'] = 'Allergen note'; translations.ja['過敏原提醒'] = 'アレルゲン注意'; translations.ko['過敏原提醒'] = '알레르기 유의'; translations.en['請向店家確認實際成分與過敏原資訊。'] = 'Confirm actual ingredients and allergen information with the shop.'; translations.ja['請向店家確認實際成分與過敏原資訊。'] = '実際の原材料とアレルゲン情報は店舗にご確認ください。'; translations.ko['請向店家確認實際成分與過敏原資訊。'] = '실제 재료와 알레르기 정보는 매장에 확인하세요.'; translations.en['換一杯'] = 'Try another'; translations.ja['換一杯'] = '別のおすすめ'; translations.ko['換一杯'] = '다른 음료'; translations.en['加入比較'] = 'Compare'; translations.ja['加入比較'] = '比較に追加'; translations.ko['加入比較'] = '비교에 추가'; translations.en['已加入比較'] = 'Added'; translations.ja['已加入比較'] = '追加済み'; translations.ko['已加入比較'] = '추가됨'; translations.en['比較清單'] = 'Comparison'; translations.ja['比較清單'] = '比較リスト'; translations.ko['比較清單'] = '비교 목록';
translations.en['草稿會保存在此瀏覽器'] = 'Draft saved in this browser'; translations.ja['草稿會保存在此瀏覽器'] = '下書きはこのブラウザーに保存されます'; translations.ko['草稿會保存在此瀏覽器'] = '초안은 이 브라우저에 저장됩니다';
translations.en['展開或收合導覽'] = 'Expand or collapse navigation';
translations.ja['展開或收合導覽'] = 'ナビゲーションを展開・折りたたむ';
translations.ko['展開或收合導覽'] = '메뉴 펼치기/접기';

let currentLocale = 'zh-Hant';
const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();
function t(source, params = {}) {
  let result = translations[currentLocale]?.[source] ?? source;
  for (const [key, value] of Object.entries(params)) result = result.replaceAll(`{${key}}`, value);
  return result;
}

function applyLocale(locale) {
  currentLocale = Object.hasOwn(localeNames, locale) ? locale : 'zh-Hant';
  document.documentElement.lang = currentLocale;
  document.title = t('茶感 Tea Sense｜飲品探索');
  document.querySelector('meta[name="description"]').content = t('以聊天探索符合口味與需求的飲品，查看人氣推薦、消息與附近店家。');

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement?.closest('#languageSelect')) continue;
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
    const original = originalTextNodes.get(node);
    const trimmed = original.trim();
    if (trimmed && translations[currentLocale]?.[trimmed]) {
      node.nodeValue = original.replace(trimmed, translations[currentLocale][trimmed]);
    } else if (trimmed) {
      node.nodeValue = original;
    }
  }

  const translatedAttributes = ['aria-label', 'title', 'placeholder', 'data-prompt'];
  document.querySelectorAll(translatedAttributes.map(attribute => `[${attribute}]`).join(',')).forEach(element => {
    let originals = originalAttributes.get(element);
    if (!originals) { originals = new Map(); originalAttributes.set(element, originals); }
    translatedAttributes.forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      if (!originals.has(attribute)) originals.set(attribute, element.getAttribute(attribute));
      const source = originals.get(attribute);
      element.setAttribute(attribute, t(source));
    });
  });

  const page = document.body.dataset.currentPage || 'home';
  document.querySelector('#pageHeading').textContent = t(pageNames[page]);
  document.querySelector('#languageSelect').value = currentLocale;
  document.querySelector('#refreshRanking').textContent = t('↻ 更新排行');
  document.querySelector('#locationStatus').textContent = t('首頁載入時會詢問位置權限，用於附近探索');
  document.querySelector('#graphDetail').textContent = t('點選圖上的圓點，探索風味關聯。');
  toast.classList.remove('show');
  toast.textContent = '';
  syncPreferenceLabels();
  filterRanking();
  renderNews();
  renderPlaces();
  if (latestWeather) renderWeather(latestWeather);
  else setWeatherMessage(weatherMessageKey, weatherIconValue);
}

function applyFontSize(size) {
  const selectedSize = Object.hasOwn(fontSizeScales, size) ? size : 'medium';
  document.body.dataset.fontSize = selectedSize;
  document.querySelector('#fontSizeSelect').value = selectedSize;
}

const services = {
  async understand(text, preferences) {
    if (AI_CONFIG.macbert.endpoint) {
      return this.post(AI_CONFIG.macbert.endpoint, { text, preferences, language: currentLocale });
    }
    // Swap this deterministic demo for the MacBERT semantic intent response.
    return { intent: 'drink_recommendation', entities: { text, preferences } };
  },
  async reply(context) {
    if (AI_CONFIG.qwen.endpoint) {
      return this.post(AI_CONFIG.qwen.endpoint, { ...context, language: currentLocale });
    }
    // A local response keeps the interface usable without a model server.
    const text = context.text.toLocaleLowerCase();
    const terms = {
      'zh-Hant': { caffeine: ['咖啡'], low: ['低熱量', '熱量'], fresh: ['清爽', '累'], mood: ['心情', '開心', '茶'] },
      en: { caffeine: ['caffeine', 'coffee'], low: ['low calorie', 'calorie'], fresh: ['refreshing', 'tired', 'light'], mood: ['mood', 'happy', 'tea'] },
      ja: { caffeine: ['カフェイン', 'コーヒー'], low: ['低カロリー', 'カロリー'], fresh: ['さっぱり', '疲れ', '爽やか'], mood: ['気分', '楽しい', 'お茶'] },
      ko: { caffeine: ['카페인', '커피'], low: ['저칼로리', '칼로리'], fresh: ['상큼', '피곤', '가볍게'], mood: ['기분', '행복', '차'] },
    }[currentLocale];
    const matches = values => values.some(value => text.includes(value));
    if (matches(terms.caffeine)) return t('可以試試洛神花茶或桂花蜜香紅茶，茶香柔和又不含咖啡因。記得確認店家的實際配方與過敏原標示喔。');
    if (matches(terms.low)) return t('推薦無糖青茶或冷泡烏龍，清爽簡單。每家店的配方和熱量不同，點餐前可以再向店家確認。');
    if (matches(terms.fresh)) return t('想清爽一點的話，試試四季春青茶加一點檸檬，微糖少冰也很適合午後。');
    if (matches(terms.mood)) return t('一杯桂花烏龍鮮奶茶很適合好心情：烏龍茶香搭配淡淡花香，建議微糖少冰。');
    return t('收到！依照你的想法，我會先從清爽茶飲開始找。你也可以告訴我想要的甜度、茶種，或需要避開的食材。');
  },
  async post(endpoint, payload) {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Service request failed (${response.status})`);
    return response.json();
  },
};

const pageNames = { home: '首頁', top: '人氣排行', news: '飲品消息', map: '附近店家', relgt: '風味關係' };
const navButtons = [...document.querySelectorAll('.nav-link')];
const pages = [...document.querySelectorAll('.page')];
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = t(message);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function navigate(page) {
  if (!pageNames[page]) return;
  navButtons.forEach(button => {
    const active = button.dataset.page === page;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  pages.forEach(section => section.classList.toggle('active', section.id === `page-${page}`));
  document.querySelector('#pageHeading').textContent = t(pageNames[page]);
  document.body.dataset.currentPage = page;
  history.replaceState(null, '', `#${page}`);
  document.querySelector('.sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
const initialPage = location.hash.slice(1);
if (pageNames[initialPage]) navigate(initialPage);

const drinks = [
  { category: 'milk', name: '桂花烏龍鮮奶茶', detail: '花香烏龍 · 溫潤奶香', emoji: '🧋', votes: '2,480', tag: '人氣冠軍' },
  { category: 'tea', name: '四季春青茶', detail: '清新回甘 · 無負擔', emoji: '🍵', votes: '1,926', tag: '清爽推薦' },
  { category: 'milk', name: '黑糖珍珠鮮奶', detail: '濃郁黑糖 · Q 彈珍珠', emoji: '🥤', votes: '1,674', tag: '經典不敗' },
  { category: 'fruit', name: '柚香翡翠', detail: '柚子果香 · 茶韻清甜', emoji: '🍋', votes: '1,438', tag: '果香系' },
  { category: 'fruit', name: '冬瓜檸檬', detail: '古早冬瓜 · 清新檸檬', emoji: '🍹', votes: '1,209', tag: '酸甜平衡' },
  { category: 'tea', name: '蜜香紅茶', detail: '天然蜜韻 · 純茶首選', emoji: '🫖', votes: '986', tag: '無奶推薦' },
  { category: 'milk', name: '芋泥波波鮮奶', detail: '綿密芋泥 · 鮮乳香醇', emoji: '🥛', votes: '854', tag: '療癒系' },
  { category: 'fruit', name: '百香雙響炮', detail: '百香果香 · 雙料口感', emoji: '🍊', votes: '726', tag: '酸甜果茶' },
  { category: 'other', name: '桂圓紅棗茶', detail: '桂圓棗香 · 暖心熱飲', emoji: '☕', votes: '613', tag: '暖心推薦' },
];
let rankingOrder = [...drinks];
function renderRanking(list = rankingOrder) {
  document.querySelector('#rankingGrid').innerHTML = list.map((drink, index) => `<article class="rank-item"><span class="rank-number">${String(index + 1).padStart(2, '0')}</span><span class="rank-emoji" aria-hidden="true">${drink.emoji}</span><div class="rank-copy"><strong>${t(drink.name)}</strong><small>${t(drink.detail)}</small></div><span class="rank-tag">${t(drink.tag)}</span><span class="rank-votes">♡ ${drink.votes}</span></article>`).join('');
}
function filterRanking() {
  const query = document.querySelector('#rankingSearch').value.trim().toLocaleLowerCase();
  const sort = document.querySelector('#rankingSort').value;
  const category = document.querySelector('#rankingCategory').value;
  const list = rankingOrder.filter(drink => (category === 'all' || drink.category === category) && `${t(drink.name)} ${t(drink.detail)} ${t(drink.tag)}`.toLocaleLowerCase().includes(query));
  if (sort === 'name') list.sort((a, b) => t(a.name).localeCompare(t(b.name), currentLocale));
  renderRanking(list);
}
document.querySelector('#rankingSearch').addEventListener('input', filterRanking);
document.querySelector('#rankingSort').addEventListener('change', filterRanking);
document.querySelector('#rankingCategory').addEventListener('change', filterRanking);
renderRanking();
document.querySelector('#refreshRanking').addEventListener('click', event => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = t('↻ 更新中');
  document.querySelector('#loadingModal').showModal();
  setTimeout(() => {
    document.querySelector('#loadingModal').close();
    button.disabled = false;
    button.textContent = t('↻ 更新排行');
    rankingOrder = [...rankingOrder.slice(1, 3), rankingOrder[0], ...rankingOrder.slice(3)];
    filterRanking();
    showToast(t('已更新展示排行'));
  }, 850);
});

const news = [
  { category: 'SEASONAL PICK', title: '桂花季來了，秋天的茶香正好', body: '從窨製烏龍到桂花蜜飲，認識這個季節最迷人的花香滋味。', source: '茶感編輯室 · 風味專題', art: '🌼', style: '' },
  { category: 'NEW ON THE MENU', title: '手炒黑糖的新喝法：搭配清焙烏龍', body: '濃郁黑糖與焙火茶韻相遇，甜而不膩的新組合值得一試。', source: '飲品情報 · 新品觀察', art: '🧋', style: 'clay' },
  { category: 'TEA & WELLNESS', title: '午後想少一點咖啡因，可以怎麼選？', body: '認識花草茶與低咖啡因茶飲，為午後留一點剛好的清醒。', source: '茶感編輯室 · 日常茶知識', art: '🌺', style: 'berry' },
  { category: 'LOCAL FINDS', title: '巷子裡的製茶小店，把茶做得很日常', body: '從產地到手沖，用一杯茶認識小店的風味故事。', source: '街角散步 · 店家故事', art: '🍃', style: 'night' },
];
function renderNews() {
  document.querySelector('#newsGrid').innerHTML = news.map(item => `<article class="news-card card"><div class="news-image ${item.style}" aria-hidden="true"><span>${item.art}</span></div><div class="news-copy"><span class="news-category">${item.category}</span><h2>${t(item.title)}</h2><p>${t(item.body)}</p><div class="news-source">${t(item.source)}</div></div></article>`).join('');
}
renderNews();

const places = [
  { name: '青禾茶室', type: '手沖茶飲 · 烏龍專門', category: '茶飲', distance: '350 m', open: true, emoji: '🍵' },
  { name: '山日子茶飲', type: '鮮奶茶 · 自家烘焙', category: '奶茶', distance: '650 m', open: true, emoji: '🧋' },
  { name: '小島製茶', type: '台灣茶 · 季節限定', category: '茶飲', distance: '900 m', open: false, emoji: '🫖' },
];
function renderPlaces() {
  const category = document.querySelector('#placeCategory')?.value || 'all';
  const maxDistance = document.querySelector('#placeDistance')?.value || 'all';
  const openOnly = document.querySelector('#filterOpen')?.checked || false;
  const filtered = places.filter(place => (category === 'all' || place.category === category) && (maxDistance === 'all' || Number.parseInt(place.distance, 10) <= Number(maxDistance)) && (!openOnly || place.open));
  document.querySelector('#placeList').innerHTML = filtered.map(place => `<div class="place-row"><span class="place-thumb" aria-hidden="true">${place.emoji}</span><span class="place-copy"><strong>${t(place.name)}</strong><small>${t(place.type)} · ${t(place.open ? '營業中' : '目前休息')}</small></span><span class="place-distance">${place.distance}</span></div>`).join('') || `<p class="muted">${t('沒有符合條件的示範店家')}</p>`;
}
document.querySelectorAll('#filterOpen, #placeCategory, #placeDistance').forEach(control => control.addEventListener('change', renderPlaces));
renderPlaces();
const weatherLabels = {
  0: '晴朗', 1: '大致晴朗', 2: '局部多雲', 3: '陰天', 45: '有霧', 48: '有霧',
  51: '毛毛雨', 53: '毛毛雨', 55: '毛毛雨', 56: '毛毛雨', 57: '毛毛雨',
  61: '下雨', 63: '下雨', 65: '下雨', 66: '下雨', 67: '下雨',
  71: '降雪', 73: '降雪', 75: '降雪', 77: '降雪', 80: '短暫陣雨', 81: '短暫陣雨', 82: '短暫陣雨', 85: '降雪', 86: '降雪', 95: '雷雨', 96: '雷雨', 99: '雷雨',
};
let latestWeather = null;
let weatherMessageKey = '允許定位後顯示目前天氣';
let weatherIconValue = '◌';
let weatherRequestId = 0;
function setWeatherMessage(messageKey, icon = '◌') {
  latestWeather = null;
  weatherMessageKey = messageKey;
  weatherIconValue = icon;
  document.querySelector('#weatherTemperature').textContent = '—°C';
  document.querySelector('#weatherDescription').textContent = t(messageKey);
  document.querySelector('#weatherIcon').textContent = icon;
}
function renderWeather(current) {
  latestWeather = current;
  const label = weatherLabels[current.weather_code] || '目前無法取得天氣資料';
  const isClearNight = current.weather_code === 0 && current.is_day === 0;
  const icons = { 晴朗: isClearNight ? '☾' : '☀', 大致晴朗: '🌤', 局部多雲: '⛅', 陰天: '☁', 有霧: '≋', 毛毛雨: '🌦', 下雨: '🌧', 短暫陣雨: '🌦', 降雪: '❄', 雷雨: '⛈' };
  document.querySelector('#weatherTemperature').textContent = `${Math.round(current.temperature_2m)}°C`;
  document.querySelector('#weatherDescription').textContent = `${t(label)} · ${t('濕度')} ${Math.round(current.relative_humidity_2m)}%`;
  document.querySelector('#weatherIcon').textContent = icons[label] || '◌';
}
async function fetchCurrentWeather(latitude, longitude) {
  const requestId = ++weatherRequestId;
  setWeatherMessage('正在取得天氣…');
  const parameters = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,is_day,weather_code',
    timezone: 'auto',
  });
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${parameters}`);
    if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
    const payload = await response.json();
    if (requestId !== weatherRequestId) return;
    if (!payload.current || !Number.isFinite(payload.current.temperature_2m)) throw new Error('Weather response is incomplete');
    renderWeather(payload.current);
  } catch (error) {
    if (requestId !== weatherRequestId) return;
    console.warn('Weather service unavailable:', error);
    setWeatherMessage('目前無法取得天氣資料');
  }
}
function locate({ automatic = false } = {}) {
  const status = document.querySelector('#locationStatus');
  if (!navigator.geolocation) {
    status.textContent = t('此瀏覽器不支援定位，顯示示意店家');
    setWeatherMessage('需要定位權限才能取得天氣');
    if (!automatic) showToast(t('瀏覽器目前不支援定位'));
    return;
  }
  status.textContent = t('正在取得位置…');
  setWeatherMessage('需要定位權限才能取得天氣');
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      status.textContent = t('已取得位置 {lat}, {lon}；店家仍為示意資料', { lat: latitude.toFixed(3), lon: longitude.toFixed(3) });
      fetchCurrentWeather(latitude, longitude);
      if (!automatic) showToast(t('定位成功；串接地圖資料後即可搜尋附近店家'));
    },
    error => {
      const messages = { 1: '你尚未授權定位，顯示示意店家', 2: '目前無法取得位置，顯示示意店家', 3: '定位逾時，顯示示意店家' };
      status.textContent = t(messages[error.code] || '定位失敗，顯示示意店家');
      setWeatherMessage('需要定位權限才能取得天氣');
      if (!automatic) showToast(t('未能取得位置，仍可瀏覽示意店家'));
    }, { enableHighAccuracy: false, timeout: 9000, maximumAge: 60000 },
  );
}
document.querySelector('#locateButton').addEventListener('click', locate);
document.querySelector('#locateFromList').addEventListener('click', locate);

const graphDrinkMatches = { '烏龍茶': ['桂花烏龍鮮奶茶', '四季春青茶'], '清香': ['四季春青茶', '柚香翡翠'], '焙火': ['黑糖珍珠鮮奶', '蜜香紅茶'], '茶韻': ['桂花烏龍鮮奶茶', '蜜香紅茶'], '桂花': ['桂花烏龍鮮奶茶'], '奶香': ['桂花烏龍鮮奶茶', '芋泥波波鮮奶'], '柑橘': ['冬瓜檸檬', '柚香翡翠'], '花香': ['桂花烏龍鮮奶茶'], '焦糖': ['黑糖珍珠鮮奶'], '木質': ['蜜香紅茶'], '蜂蜜': ['蜜香紅茶'], '鮮奶': ['桂花烏龍鮮奶茶', '芋泥波波鮮奶'], '珍珠': ['黑糖珍珠鮮奶', '百香雙響炮'], '回甘': ['四季春青茶'] };
const graphConnections = { '烏龍茶': ['清香', '焙火', '茶韻', '桂花', '奶香'], '清香': ['烏龍茶', '柑橘', '花香'], '焙火': ['烏龍茶', '焦糖', '木質'], '茶韻': ['烏龍茶', '回甘'], '桂花': ['烏龍茶', '香氣', '蜂蜜'], '奶香': ['烏龍茶', '鮮奶', '珍珠'], '柑橘': ['清香'], '花香': ['清香'], '焦糖': ['焙火'], '木質': ['焙火'], '香氣': ['桂花'], '蜂蜜': ['桂花'], '鮮奶': ['奶香'], '珍珠': ['奶香'], '回甘': ['茶韻'] };
document.querySelectorAll('.graph-node').forEach(node => node.addEventListener('click', () => {
  const name = t(node.dataset.name);
  const linkedNames = graphConnections[node.dataset.name] || [];
  const selectedNodes = [...document.querySelectorAll('.graph-node')].filter(other => linkedNames.includes(other.dataset.name));
  document.querySelectorAll('.graph-node').forEach(other => other.classList.toggle('dim', other !== node && !selectedNodes.includes(other)));
  document.querySelectorAll('.graph-node').forEach(other => { other.classList.toggle('selected', other === node); other.setAttribute('aria-pressed', String(other === node)); });
  const related = linkedNames.map(t).join('、');
  document.querySelector('#graphDetail').textContent = `${name}: ${t('相關風味')} ${related}。${t('關聯為示範資料')}`;
  const matching = graphDrinkMatches[node.dataset.name] || []; const mount = document.querySelector('#graphDrinks'); mount.replaceChildren();
  if (matching.length) { const title = document.createElement('strong'); title.textContent = t('相關示範飲品'); mount.append(title); matching.forEach(drink => { const button = document.createElement('button'); button.type = 'button'; button.textContent = t(drink); button.addEventListener('click', () => { navigate('home'); sendMessage(`${t(drink)} ${t('風味推薦')}`); }); mount.append(button); }); }
}));
document.querySelectorAll('.graph-node').forEach(node => node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); node.dispatchEvent(new MouseEvent('click', { bubbles: true })); } }));

function getPreferences() {
  const selected = [...document.querySelectorAll('.preference-options input:checked')].map(input => input.value);
  return selected.length ? selected : [];
}
const preferenceSummaryDefaults = new WeakMap([...document.querySelectorAll('.preference-item')].map(details => [
  details.querySelector('summary small'), details.querySelector('summary small').textContent,
]));
function syncPreferenceLabels() {
  document.querySelectorAll('.preference-item').forEach(details => {
    const summary = details.querySelector('summary small');
    const selected = [...details.querySelectorAll('input:checked')].map(input => t(input.value));
    const separator = currentLocale === 'en' ? ', ' : '、';
    summary.textContent = selected.length ? selected.join(separator) : t(preferenceSummaryDefaults.get(summary));
  });
}
function saveChat() {
  try { const messages = [...document.querySelectorAll('#chatMessages .message')]; const firstBubble = messages[0]?.querySelector('.bubble')?.textContent || ''; const isWelcome = messages[0]?.classList.contains('assistant-message') && firstBubble.startsWith('嗨！今天想喝點什麼呢？'); const saved = messages.slice(isWelcome ? 1 : 0).map(message => ({ role: message.classList.contains('user-message') ? 'user' : 'assistant', text: message.querySelector('.bubble')?.childNodes[0]?.textContent || message.querySelector('.bubble')?.textContent || '' })); localStorage.setItem('teaSenseChat', JSON.stringify(saved)); } catch {}
}
const demoRecommendations = [
  { name: '桂花烏龍鮮奶茶', flavor: '花香、茶韻、奶香', sweetness: '微糖少冰', calories: '約 250–350 大卡', caffeine: '含咖啡因', caffeineLevel: 'high', allergens: ['乳製品'], tea: '烏龍茶', category: 'milk' },
  { name: '四季春青茶', flavor: '清香、清爽、回甘', sweetness: '無糖少冰', calories: '約 0–80 大卡', caffeine: '含咖啡因', caffeineLevel: 'medium', allergens: [], tea: '綠茶', category: 'tea' },
  { name: '桂圓紅棗茶', flavor: '溫潤、果甜、暖香', sweetness: '建議無額外加糖', calories: '依配方而異', caffeine: '通常不含咖啡因', caffeineLevel: 'none', allergens: [], tea: '花草茶', category: 'other' },
];
let recommendationIndex = 0;
const comparedDrinks = [];
function matchingRecommendations() {
  const prefs = getPreferences();
  const allergenPrefs = prefs.filter(value => ['乳製品', '堅果', '蜂蜜', '大豆'].includes(value));
  const maxCalories = prefs.includes('低於 150 大卡') ? 150 : prefs.includes('低於 300 大卡') ? 300 : Infinity;
  const wantsNoCaffeine = prefs.includes('無咖啡因');
  const candidates = demoRecommendations.filter(item => (!allergenPrefs.some(allergen => item.allergens.includes(allergen))) && (!wantsNoCaffeine || item.caffeineLevel === 'none') && (!prefs.includes('低咖啡因') || ['low', 'none'].includes(item.caffeineLevel)) && (item.calories.startsWith('約 ') ? Number([...item.calories.matchAll(/\d+/g)].at(-1)?.[0] || 0) <= maxCalories : maxCalories === Infinity) && (!prefs.some(value => ['烏龍茶','紅茶','綠茶','花草茶'].includes(value)) || prefs.includes(item.tea)));
  return candidates.length ? { items: candidates, hasMatch: true } : { items: demoRecommendations, hasMatch: false };
}
function renderComparison() {
  const mount = document.querySelector('#recommendationCompare'); mount.replaceChildren();
  if (!comparedDrinks.length) return;
  const heading = document.createElement('strong'); heading.textContent = t('飲品比較'); mount.append(heading);
  const table = document.createElement('div'); table.className = 'comparison-grid';
  const labels = ['品項', '風味', '建議甜度', '熱量', '咖啡因', '過敏原提醒'];
  const headingCell = document.createElement('div'); headingCell.className = 'comparison-row comparison-heading';
  labels.forEach(label => { const cell = document.createElement('span'); cell.textContent = t(label); headingCell.append(cell); }); table.append(headingCell);
  comparedDrinks.forEach((item, index) => {
    const row = document.createElement('div'); row.className = 'comparison-row';
    [item.name, item.flavor, item.sweetness, item.calories, item.caffeine, item.allergens.length ? item.allergens.join('、') : '未標示'].forEach(value => { const cell = document.createElement('span'); cell.textContent = t(value); row.append(cell); });
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = t('移除'); remove.addEventListener('click', () => { comparedDrinks.splice(index, 1); renderComparison(); }); row.append(remove); table.append(row);
  }); mount.append(table);
}

function renderRecommendationCard(container) {
  const filtered = matchingRecommendations();
  const item = filtered.items[recommendationIndex % filtered.items.length];
  container.querySelector('.recommendation-card')?.remove();
  const card = document.createElement('section'); card.className = 'recommendation-card'; card.setAttribute('aria-label', t('示範推薦卡'));
  const title = document.createElement('strong'); title.textContent = t(item.name);
  const flavor = document.createElement('p'); flavor.textContent = `${t('風味')}：${t(item.flavor)}`;
  const specs = document.createElement('p'); specs.textContent = `${t('建議甜度')}：${t(item.sweetness)}　·　${t('熱量')}：${t(item.calories)}　·　${t('咖啡因')}：${t(item.caffeine)}`;
  const allergen = document.createElement('small'); allergen.textContent = `${t('過敏原提醒')}：${item.allergens.length ? item.allergens.map(t).join('、') : t('示範資料未標示常見過敏原')}。${t('請向店家確認實際成分與過敏原資訊。')}`;
  if (!filtered.hasMatch) { const note = document.createElement('small'); note.className = 'recommendation-note'; note.textContent = t('目前示範清單中沒有完全符合條件的品項，以下列出一般示範選項供參考。'); card.append(note); }
  const actions = document.createElement('div'); actions.className = 'recommendation-actions';
  const swap = document.createElement('button'); swap.type = 'button'; swap.textContent = t('換一杯'); swap.addEventListener('click', () => { recommendationIndex = (recommendationIndex + 1) % matchingRecommendations().items.length; renderRecommendationCard(container); });
  const compare = document.createElement('button'); compare.type = 'button'; compare.textContent = t('加入比較'); compare.addEventListener('click', () => { if (!comparedDrinks.some(entry => entry.name === item.name)) comparedDrinks.push(item); compare.textContent = t('已加入比較'); renderComparison(); });
  actions.append(swap, compare); card.append(title, flavor, specs, allergen, actions); container.append(card);
}

function addMessage(text, role) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role === 'user' ? 'user-message' : 'assistant-message'}`;
  const body = document.createElement('div');
  body.className = 'message-body';
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.textContent = t(role === 'user' ? '你 · 現在' : '茶感小助手 · 現在');
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  if (role !== 'user') {
    const avatar = document.createElement('span'); avatar.className = 'message-avatar'; avatar.textContent = '茶';
    wrapper.append(avatar);
  }
  body.append(meta, bubble);
  const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'message-delete'; remove.textContent = t('刪除'); remove.setAttribute('aria-label', `${t('刪除')} ${text.slice(0, 30)}`);
  body.append(remove); wrapper.append(body);
  document.querySelector('#chatMessages').append(wrapper);
  saveChat();
  wrapper.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
async function sendMessage(text, { appendUser = true } = {}) {
  const cleaned = text.trim();
  if (!cleaned) return;
  document.body.classList.add('conversation-active');
  document.querySelector('.chat-card').classList.add('conversation-active');
  if (appendUser) addMessage(cleaned, 'user');
  document.querySelector('#chatInput').value = '';
  const modal = document.querySelector('#loadingModal');
  modal.showModal();
  try {
    const intent = await services.understand(cleaned, getPreferences());
    const answer = await services.reply({ text: cleaned, preferences: getPreferences(), intent, history: [], language: currentLocale });
    setTimeout(() => {
      modal.close();
      addMessage(typeof answer === 'string' ? answer : (answer.reply || answer.text || t('我找到一些飲品方向，告訴我更多偏好就能幫你縮小選擇。')), 'assistant');
      if (!AI_CONFIG.qwen.endpoint) renderRecommendationCard(document.querySelector('#chatMessages .assistant-message:last-child .bubble'));
    }, 650);
  } catch (error) {
    modal.close();
    addMessage(t('目前暫時無法連線到推薦服務，請稍後再試。你仍可使用偏好選擇與其他展示頁面。'), 'assistant');
    const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'retry-button'; retry.textContent = t('重試'); retry.addEventListener('click', () => { const lastUser = [...document.querySelectorAll('#chatMessages .user-message')].at(-1)?.querySelector('.bubble')?.textContent; document.querySelector('#chatMessages .assistant-message:last-child')?.remove(); if (lastUser) sendMessage(lastUser, { appendUser: false }); }); document.querySelector('#chatMessages .assistant-message:last-child .message-body')?.append(retry);
    console.error('Recommendation service error:', error);
  }
}
document.querySelector('#chatMessages').addEventListener('click', event => {
  if (event.target.closest('.message-delete')) { event.target.closest('.message').remove(); saveChat(); }
});
document.querySelector('#regenerateChat').addEventListener('click', () => {
  const messages = [...document.querySelectorAll('#chatMessages .user-message')]; const latest = messages.at(-1)?.querySelector('.bubble')?.textContent;
  if (latest) { document.querySelector('#chatMessages .assistant-message:last-child')?.remove(); sendMessage(latest, { appendUser: false }); }
});
document.querySelector('#clearChat').addEventListener('click', () => {
  document.querySelector('#chatMessages').innerHTML = '';
  const welcome = document.createElement('div'); welcome.className = 'message assistant-message';
  const avatar = document.createElement('span'); avatar.className = 'message-avatar'; avatar.textContent = '茶';
  const body = document.createElement('div'); body.className = 'message-body';
  const meta = document.createElement('div'); meta.className = 'message-meta'; meta.textContent = t('茶感小助手 · 現在');
  const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.textContent = t('嗨！今天想喝點什麼呢？可以告訴我你的心情、口味，或是想避開的食材。');
  const card = document.createElement('div'); card.className = 'suggestion-card';
  const kicker = document.createElement('div'); kicker.className = 'suggestion-kicker'; kicker.textContent = t('今日靈感');
  const name = document.createElement('strong'); name.textContent = t('桂花烏龍鮮奶茶');
  const description = document.createElement('span'); description.textContent = t('茶香溫潤 · 微糖少冰');
  card.append(kicker, name, description); bubble.append(card); body.append(meta, bubble); welcome.append(avatar, body); document.querySelector('#chatMessages').append(welcome);
  document.body.classList.remove('conversation-active'); document.querySelector('.chat-card').classList.remove('conversation-active');
  document.querySelector('#recommendationCompare').textContent = ''; comparedDrinks.length = 0;
  try { localStorage.removeItem('teaSenseChat'); } catch {}
});
document.querySelector('#chatForm').addEventListener('submit', event => { event.preventDefault(); sendMessage(document.querySelector('#chatInput').value); });
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => sendMessage(button.dataset.prompt)));
document.querySelectorAll('.preference-options input').forEach(input => input.addEventListener('change', () => { syncPreferenceLabels(); }));
document.querySelector('#applyPreferences').addEventListener('click', () => {
  const preferences = getPreferences();
  try { localStorage.setItem('teaSenseDrinkPreferences', JSON.stringify(preferences)); } catch {}
  showToast(preferences.length ? t('已套用 {count} 項偏好', { count: preferences.length }) : t('已清除偏好條件'));
  document.querySelectorAll('#chatMessages .assistant-message').forEach(message => { if (message.querySelector('.recommendation-card')) renderRecommendationCard(message.querySelector('.bubble')); });
  closeDrinkPreferences();
});

const feedbackModal = document.querySelector('#feedbackModal');
const feedbackForm = document.querySelector('#feedbackForm');
const feedbackText = document.querySelector('#feedbackText');
try { const draft = localStorage.getItem('teaSenseFeedbackDraft'); if (draft) { const parsed = JSON.parse(draft); feedbackText.value = parsed.text || ''; document.querySelector('#feedbackType').value = parsed.type || document.querySelector('#feedbackType').value; } } catch {}
feedbackForm.addEventListener('input', () => { try { localStorage.setItem('teaSenseFeedbackDraft', JSON.stringify({ text: feedbackText.value, type: document.querySelector('#feedbackType').value })); } catch {} });
document.querySelector('#feedbackButton').addEventListener('click', () => feedbackModal.showModal());
document.querySelectorAll('[data-close-dialog]').forEach(button => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});
document.querySelector('#feedbackForm').addEventListener('submit', event => {
  event.preventDefault();
  feedbackModal.close();
  event.currentTarget.reset();
  try { localStorage.removeItem('teaSenseFeedbackDraft'); } catch {}
  showToast('回饋已在本機示範送出；正式版需設定接收服務');
});

const preferencesModal = document.querySelector('#preferencesModal');
function openPreferences() {
  document.querySelector('#themeSelect').value = document.body.classList.contains('dark') ? 'dark' : 'light';
  preferencesModal.showModal();
}
document.querySelector('#profileButton').addEventListener('click', openPreferences);
const drinkPreferencesModal = document.querySelector('#drinkPreferencesModal');
const drinkPreferencesButton = document.querySelector('#openDrinkPreferences');
function closeDrinkPreferences() {
  if (drinkPreferencesModal.open) drinkPreferencesModal.close();
  drinkPreferencesButton.setAttribute('aria-expanded', 'false');
}
drinkPreferencesButton.addEventListener('click', () => {
  if (drinkPreferencesModal.open) closeDrinkPreferences();
  else {
    drinkPreferencesModal.show();
    drinkPreferencesButton.setAttribute('aria-expanded', 'true');
  }
});
document.querySelector('#closeDrinkPreferences').addEventListener('click', closeDrinkPreferences);
drinkPreferencesModal.addEventListener('click', event => {
  if (event.target === drinkPreferencesModal) closeDrinkPreferences();
});
document.addEventListener('pointerdown', event => {
  if (drinkPreferencesModal.open && !drinkPreferencesModal.contains(event.target) && event.target !== drinkPreferencesButton) closeDrinkPreferences();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && drinkPreferencesModal.open) closeDrinkPreferences();
});
drinkPreferencesModal.addEventListener('close', () => drinkPreferencesButton.setAttribute('aria-expanded', 'false'));
document.querySelector('#settingsForm').addEventListener('submit', event => {
  event.preventDefault();
  document.body.classList.toggle('dark', document.querySelector('#themeSelect').value === 'dark');
  const selectedLocale = document.querySelector('#languageSelect').value;
  const selectedFontSize = document.querySelector('#fontSizeSelect').value;
  applyLocale(selectedLocale);
  applyFontSize(selectedFontSize);
  try {
    localStorage.setItem('teaSenseLanguage', selectedLocale);
    localStorage.setItem('teaSenseFontSize', selectedFontSize);
    localStorage.setItem('teaSenseTheme', document.querySelector('#themeSelect').value);
  } catch { /* Settings remain active for this session. */ }
  preferencesModal.close();
  showToast(t('設定已套用'));
});
document.querySelector('#sidebarToggle').addEventListener('click', () => {
  document.body.classList.toggle('sidebar-expanded');
  document.querySelector('#sidebarToggle').setAttribute('aria-expanded', String(document.body.classList.contains('sidebar-expanded')));
});
document.querySelector('#mobileMenu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.addEventListener('click', event => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !event.target.closest('#mobileMenu')) sidebar.classList.remove('open');
});

let savedLocale = 'zh-Hant';
try {
  const storedLocale = localStorage.getItem('teaSenseLanguage');
  if (storedLocale && Object.hasOwn(localeNames, storedLocale)) savedLocale = storedLocale;
} catch { /* Use Traditional Chinese when browser storage is unavailable. */ }
applyLocale(savedLocale);
try { const savedPrefs = JSON.parse(localStorage.getItem('teaSenseDrinkPreferences') || '[]'); document.querySelectorAll('.preference-options input').forEach(input => input.checked = savedPrefs.includes(input.value)); syncPreferenceLabels(); } catch {}
try { const savedChat = JSON.parse(localStorage.getItem('teaSenseChat') || '[]'); if (savedChat.length) { const container = document.querySelector('#chatMessages'); container.innerHTML = ''; savedChat.forEach(item => { addMessage(String(item.text || ''), item.role === 'user' ? 'user' : 'assistant'); if (item.role !== 'user' && !AI_CONFIG.qwen.endpoint) renderRecommendationCard(document.querySelector('#chatMessages .assistant-message:last-child .bubble')); }); document.body.classList.add('conversation-active'); document.querySelector('.chat-card').classList.add('conversation-active'); } } catch {}
let savedFontSize = 'medium';
try {
  const storedFontSize = localStorage.getItem('teaSenseFontSize');
  if (storedFontSize && Object.hasOwn(fontSizeScales, storedFontSize)) savedFontSize = storedFontSize;
} catch { /* Use medium text when browser storage is unavailable. */ }
applyFontSize(savedFontSize);
let savedTheme = 'light';
try {
  if (localStorage.getItem('teaSenseTheme') === 'dark') savedTheme = 'dark';
} catch { /* Use the warm theme when browser storage is unavailable. */ }
document.body.classList.toggle('dark', savedTheme === 'dark');
if (document.body.dataset.currentPage === 'home') locate({ automatic: true });
