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
    '午後微暖': 'Warm afternoon', '適合來點清爽的': 'Perfect for something refreshing', '開啟首頁時會詢問位置權限，用於尋找附近店家；不會持續追蹤。': 'On the homepage, we’ll ask to use your location to find nearby shops. We won’t track you in the background.', '首頁載入時會詢問位置權限，用於附近探索': 'Location permission is requested when the homepage opens to help explore nearby.', '茶感小助手': 'Tea Sense Assistant', '隨時為你找靈感': 'Here to inspire your next sip', '清除對話': 'Clear chat',
    '現在': 'Now', '嗨！今天想喝點什麼呢？可以告訴我你的心情、口味，或是想避開的食材。': 'Hi! What are you in the mood for? Tell me a flavor you like, how you feel, or an ingredient to avoid.', '今日靈感': 'Today’s pick', '桂花烏龍鮮奶茶': 'Osmanthus Oolong Milk Tea', '茶香溫潤 · 微糖少冰': 'Fragrant and mellow · Less sugar, light ice',
    '快速需求': 'Quick prompts', '今天有點累，想喝清爽的': 'I feel tired; recommend something refreshing', '推薦低熱量的飲料': 'Recommend a low-calorie drink', '我今天心情不錯，想喝茶': 'I’m in a good mood and would like tea', '無咖啡因又不太甜的飲料': 'A caffeine-free drink that is not too sweet', '想喝清爽的': 'Something refreshing', '低熱量': 'Low calorie', '好心情': 'Good mood', '輸入飲品需求': 'Enter your drink preferences', '輸入你的飲品需求…': 'Tell us what you feel like drinking…', '送出訊息': 'Send message', '試試看：': 'Try: ', '無咖啡因又不太甜': 'Caffeine-free and not too sweet', '你的偏好只用來推薦': 'Your preferences are only used for recommendations',
    '今天的偏好': 'Your preferences', '調整條件，讓推薦更貼近你。': 'Fine-tune your preferences for better suggestions.', '熱量': 'Calories', '不限': 'Any', '不限茶種': 'Any tea', '咖啡因': 'Caffeine', '飲料配料': 'Toppings', '珍珠、椰果': 'Boba, coconut jelly', '珍珠': 'Boba', '椰果': 'Coconut jelly', '仙草': 'Grass jelly', '不加配料': 'No toppings', '心情': 'Mood', '選擇你的心情': 'Choose your mood', '放鬆': 'Relax', '想放鬆': 'Relax', '提振精神': 'Energy boost', '開心': 'Happy', '心情愉快': 'Feeling good', '茶種': 'Tea type', '烏龍茶': 'Oolong', '紅茶': 'Black tea', '綠茶': 'Green tea', '花草茶': 'Herbal tea', '過敏原': 'Allergens', '尚未設定': 'Not set', '乳製品': 'Dairy', '堅果': 'Nuts', '蜂蜜': 'Honey', '大豆': 'Soy', '低於 150 大卡': 'Under 150 kcal', '低於 300 大卡': 'Under 300 kcal', '低咖啡因': 'Low caffeine', '無咖啡因': 'Caffeine-free', '套用偏好': 'Apply preferences',
    '慢慢選，總會找到喜歡的那一杯。': 'Take your time. Your next favorite is out there.', '大家都在喝': 'What everyone’s ', '什麼': 'drinking', '看看最近最受歡迎的飲品，找一杯你的下一個喜歡。': 'Explore popular drinks and find your next favorite.', '↻ 更新排行': '↻ Refresh ranking', '↻ 更新中': '↻ Updating', 'POPULAR THIS WEEK': 'POPULAR THIS WEEK', '本週人氣': 'THIS WEEK', '人氣冠軍': 'Most loved', '清爽推薦': 'Refreshing', '經典不敗': 'Classic', '果香系': 'Fruity', '酸甜平衡': 'Sweet & tart', '無奶推薦': 'Dairy-free pick', '療癒系': 'Comforting', '酸甜果茶': 'Sweet & tart tea', '暖心推薦': 'Warming',
    '四季春青茶': 'Four Seasons Green Tea', '黑糖珍珠鮮奶': 'Brown Sugar Boba Milk', '柚香翡翠': 'Yuzu Jade Tea', '冬瓜檸檬': 'Winter Melon Lemon Tea', '蜜香紅茶': 'Honey Aroma Black Tea', '芋泥波波鮮奶': 'Taro Boba Milk', '百香雙響炮': 'Passion Fruit Double Topping Tea', '桂圓紅棗茶': 'Longan Jujube Tea', '花香烏龍 · 溫潤奶香': 'Floral oolong · Creamy and mellow', '清新回甘 · 無負擔': 'Clean finish · Light and easy', '濃郁黑糖 · Q 彈珍珠': 'Rich brown sugar · Chewy boba', '柚子果香 · 茶韻清甜': 'Yuzu citrus · Light tea notes', '古早冬瓜 · 清新檸檬': 'Traditional winter melon · Fresh lemon', '天然蜜韻 · 純茶首選': 'Natural honey notes · Pure tea', '綿密芋泥 · 鮮乳香醇': 'Creamy taro · Fresh milk', '百香果香 · 雙料口感': 'Passion fruit · Two toppings', '桂圓棗香 · 暖心熱飲': 'Longan and jujube · A warming cup',
    '飲品': 'Tea & drinks', '新鮮事': 'Fresh finds', '新品、店家消息與茶飲靈感，最近都在這裡。': 'New drinks, shop news, and tea inspiration—all here.', '桂花季來了，秋天的茶香正好': 'Osmanthus season is here: a perfect autumn tea', '從窨製烏龍到桂花蜜飲，認識這個季節最迷人的花香滋味。': 'From scented oolong to osmanthus tea, explore the floral flavors of the season.', '茶感編輯室 · 風味專題': 'Tea Sense Editorial · Flavor story', '手炒黑糖的新喝法：搭配清焙烏龍': 'A new take on brown sugar with lightly roasted oolong', '濃郁黑糖與焙火茶韻相遇，甜而不膩的新組合值得一試。': 'Rich brown sugar meets roasted tea for a sweet, balanced pairing.', '飲品情報 · 新品觀察': 'Drink notes · New on the menu', '午後想少一點咖啡因，可以怎麼選？': 'How to choose a lower-caffeine afternoon tea', '認識花草茶與低咖啡因茶飲，為午後留一點剛好的清醒。': 'Discover herbal and low-caffeine teas for a gentle afternoon lift.', '茶感編輯室 · 日常茶知識': 'Tea Sense Editorial · Tea basics', '巷子裡的製茶小店，把茶做得很日常': 'A neighborhood tea shop makes tea part of everyday life', '從產地到手沖，用一杯茶認識小店的風味故事。': 'Discover a local shop’s tea story, from origin to pour.', '街角散步 · 店家故事': 'Around the corner · Shop story', '展示用文章為原型內容；正式上線時請串接授權的新聞與店家來源。': 'Sample articles for this prototype. Connect licensed news and shop sources before launch.',
    '巷口的': 'Around the corner,', '好茶': 'good tea', '找到附近值得停下來的飲料店。': 'Find a nearby shop worth stopping for.', '附近飲料店': 'Nearby tea shops', '使用目前位置探索周邊': 'Use your location to explore nearby', '⌖ 使用目前位置': '⌖ Use my location', '示意街區地圖': 'Illustrative neighborhood map', '青禾茶室': 'Green Grain Tea Room', '山日子茶飲': 'Mountain Day Tea', '小島製茶': 'Island Tea Works', '示意地圖': 'Illustrative map', '店家位置目前為示意資料。定位需在 HTTPS 或 localhost 下由你明確授權。': 'Shop locations are illustrative. Location access requires your permission on HTTPS or localhost.', '附近推薦': 'Nearby picks', 'CURATED NEARBY': 'CURATED NEARBY', '手沖茶飲 · 烏龍專門': 'Hand-brewed tea · Oolong specialist', '鮮奶茶 · 自家烘焙': 'Milk tea · House-roasted tea', '台灣茶 · 季節限定': 'Taiwanese tea · Seasonal picks', '⌖ 尋找我的位置': '⌖ Find my location',
    '風味彼此': 'Where flavors', '相遇': 'meet', '看看茶種、配料和風味之間，有哪些有趣的連結。': 'Explore connections between tea, toppings, and flavor.', '風味關係圖': 'Flavor map', '選一個節點看看相關風味': 'Select a node to explore related flavors', '風味': 'Flavor', '配料': 'Toppings', '烏龍茶': 'Oolong', '清香': 'Fresh aroma', '焙火': 'Roasted', '茶韻': 'Tea notes', '桂花': 'Osmanthus', '奶香': 'Milky', '鮮奶': 'Fresh milk', '柑橘': 'Citrus', '花香': 'Floral', '焦糖': 'Caramel', '木質': 'Woody', '香氣': 'Aroma', '回甘': 'Sweet finish', '點選圖上的圓點，探索風味關聯。': 'Select a node to explore flavor connections.', '目前關係圖為可互動的示意資料，可替換為 RelGT 模型輸出。': 'Interactive sample data. This graph can later use RelGT model output.',
    'WE’D LOVE TO HEAR': 'WE’D LOVE TO HEAR', '讓茶感更好一點': 'Help us make Tea Sense better', '遇到問題、想推薦飲料，或有任何想法都歡迎告訴我們。': 'Report an issue, recommend a drink, or share an idea.', '回饋類型': 'Feedback type', '推薦不符合期待': 'Recommendation missed the mark', '回報錯誤': 'Report a problem', '分享飲品或店家': 'Share a drink or shop', '其他想法': 'Other idea', '回饋內容': 'Your feedback', '寫下你的想法…': 'Tell us what you think…', '提供回饋': 'Send feedback', '送出回饋': 'Submit feedback', '關閉': 'Close', 'YOUR SETTINGS': 'YOUR SETTINGS', '個人化設定': 'Personalize', '選擇你偏好的使用方式。': 'Choose how you’d like to use Tea Sense.', '語言': 'Language', '繁體中文': 'Traditional Chinese', '暖白茶室': 'Warm tea room', '夜間茶席': 'Evening tea room', '字體大小': 'Text size', '小字體': 'Small', '中字體': 'Medium', '大字體': 'Large', '儲存設定': 'Save settings', '正在為你找靈感': 'Finding inspiration for you', '整理口味偏好，挑選合適的飲品…': 'Considering your preferences and finding a drink…',
    '你 · 現在': 'You · Now', '茶感小助手 · 現在': 'Tea Sense Assistant · Now', '對話已重置。今天想從什麼口味開始？': 'Chat cleared. What flavors are you in the mood for?',
    '可以試試洛神花茶或桂花蜜香紅茶，茶香柔和又不含咖啡因。記得確認店家的實際配方與過敏原標示喔。': 'Try hibiscus tea or osmanthus honey black tea for a gentle, caffeine-free sip. Check the shop’s ingredients and allergen information.', '推薦無糖青茶或冷泡烏龍，清爽簡單。每家店的配方和熱量不同，點餐前可以再向店家確認。': 'Try unsweetened green tea or cold-brew oolong. Recipes and calories vary by shop, so please check before ordering.', '想清爽一點的話，試試四季春青茶加一點檸檬，微糖少冰也很適合午後。': 'For something refreshing, try Four Seasons green tea with lemon, lightly sweetened and with less ice.', '一杯桂花烏龍鮮奶茶很適合好心情：烏龍茶香搭配淡淡花香，建議微糖少冰。': 'Osmanthus oolong milk tea is a lovely match for a good mood: fragrant tea with floral notes, lightly sweetened and with less ice.', '收到！依照你的想法，我會先從清爽茶飲開始找。你也可以告訴我想要的甜度、茶種，或需要避開的食材。': 'Got it! I’ll start with refreshing teas. You can also tell me your preferred sweetness, tea type, or ingredients to avoid.', '我找到一些飲品方向，告訴我更多偏好就能幫你縮小選擇。': 'I have a few ideas. Share more preferences and I can narrow them down.', '目前暫時無法連線到推薦服務，請稍後再試。你仍可使用偏好選擇與其他展示頁面。': 'The recommendation service is temporarily unavailable. Please try again later; preferences and other pages are still available.', '↻ 更新排行': '↻ Refresh ranking', '↻ 更新中': '↻ Updating', '已更新展示排行': 'Sample ranking refreshed', '對話已重置': 'Chat cleared', '已清除偏好條件': 'Preferences cleared', '回饋已在本機示範送出；正式版需設定接收服務': 'Feedback submitted in this demo; a live version needs a receiving service', '設定已套用': 'Settings applied', '已套用 {count} 項偏好': 'Applied {count} preferences',
    '此瀏覽器不支援定位，顯示示意店家': 'Geolocation is not supported. Showing sample shops.', '瀏覽器目前不支援定位': 'Your browser does not support geolocation.', '正在取得位置…': 'Getting your location…', '已取得位置 {lat}, {lon}；店家仍為示意資料': 'Location found: {lat}, {lon}. Shop data is still illustrative.', '定位成功；串接地圖資料後即可搜尋附近店家': 'Location found. Connect map data to search for nearby shops.', '你尚未授權定位，顯示示意店家': 'Location permission was not granted. Showing sample shops.', '目前無法取得位置，顯示示意店家': 'Could not get your location. Showing sample shops.', '定位逾時，顯示示意店家': 'Location request timed out. Showing sample shops.', '定位失敗，顯示示意店家': 'Could not get your location. Showing sample shops.', '未能取得位置，仍可瀏覽示意店家': 'Location unavailable. You can still browse sample shops.', '已選取風味節點': 'Selected flavor node', '正式版本可由 RelGT 模型提供關聯強度與推薦說明。': 'A production RelGT model can provide relationship strength and recommendations.',
    '以聊天探索符合口味與需求的飲品，查看人氣推薦、消息與附近店家。': 'Explore drinks by chat, browse popular picks and news, and find nearby shops.', '茶感 Tea Sense｜飲品探索': 'Tea Sense | Drink discovery', 'HOME': 'HOME',
  },
  ja: {
    '探索': '探索', '首頁': 'ホーム', '人氣排行': '人気ランキング', '飲品消息': 'ドリンクニュース', '附近店家': '近くのお店', '風味關係': '風味マップ', '回饋': 'フィードバック', '對話內容': 'チャットメッセージ', '可互動的飲品風味關係圖': 'ドリンク風味のインタラクティブマップ', '頁面風格': 'テーマ',
    '主要導覽': 'メインナビゲーション', '茶感首頁': '茶感ホーム', '今天喝什麼？': '今日は何を飲もう？', '告訴我們你的心情': '今の気分を教えてください', '訪客模式': 'ゲストモード', '個人化設定': '設定',
    '偏好設定': '設定', '開啟選單': 'メニューを開く', 'YOUR DAILY CUP': '今日の一杯', '找到今天的': '今日の', '好味道': 'お気に入りを見つけよう', '說說你的心情，讓我們一起找杯剛剛好的飲料。': '気分を教えてください。ぴったりの一杯を一緒に探しましょう。',
    '午後微暖': '午後は穏やか', '適合來點清爽的': 'さっぱりした一杯にぴったり', '開啟首頁時會詢問位置權限，用於尋找附近店家；不會持續追蹤。': 'ホームを開くと、近くのお店を探すために位置情報の許可を確認します。常時追跡は行いません。', '首頁載入時會詢問位置權限，用於附近探索': 'ホームの読み込み時に、近くを探すため位置情報の許可を確認します。', '茶感小助手': 'Tea Sense アシスタント', '隨時為你找靈感': '次の一杯をご提案します', '清除對話': '会話をクリア',
    '現在': '今', '嗨！今天想喝點什麼呢？可以告訴我你的心情、口味，或是想避開的食材。': 'こんにちは！今日は何を飲みたいですか？気分や好み、避けたい食材を教えてください。', '今日靈感': '今日のおすすめ', '桂花烏龍鮮奶茶': '桂花ウーロンミルクティー', '茶香溫潤 · 微糖少冰': 'まろやかな茶の香り · 甘さ控えめ・氷少なめ',
    '快速需求': 'クイックリクエスト', '今天有點累，想喝清爽的': '少し疲れたので、さっぱりしたものが飲みたい', '推薦低熱量的飲料': '低カロリーの飲み物をおすすめして', '我今天心情不錯，想喝茶': '今日は気分がいいので、お茶が飲みたい', '無咖啡因又不太甜的飲料': 'カフェイン控えめで甘さ控えめの飲み物', '想喝清爽的': 'さっぱりしたもの', '低熱量': '低カロリー', '好心情': '気分よく', '輸入飲品需求': '飲み物の希望を入力', '輸入你的飲品需求…': '飲みたいものを入力してください…', '送出訊息': 'メッセージを送信', '試試看：': 'おすすめ：', '無咖啡因又不太甜': 'カフェイン控えめで甘さ控えめ', '你的偏好只用來推薦': '設定はおすすめのためだけに使用します',
    '今天的偏好': '今日の好み', '調整條件，讓推薦更貼近你。': '好みを選んで、ぴったりの提案に。', '熱量': 'カロリー', '不限': '指定なし', '不限茶種': '茶種指定なし', '咖啡因': 'カフェイン', '飲料配料': 'トッピング', '珍珠、椰果': 'タピオカ、ナタデココ', '珍珠': 'タピオカ', '椰果': 'ナタデココ', '仙草': '仙草ゼリー', '不加配料': 'トッピングなし', '心情': '気分', '選擇你的心情': '気分を選択', '放鬆': 'リラックス', '想放鬆': 'リラックスしたい', '提振精神': '元気を出したい', '開心': '楽しい', '心情愉快': '気分がいい', '茶種': '茶種', '烏龍茶': 'ウーロン茶', '紅茶': '紅茶', '綠茶': '緑茶', '花草茶': 'ハーブティー', '過敏原': 'アレルゲン', '尚未設定': '未設定', '乳製品': '乳製品', '堅果': 'ナッツ', '蜂蜜': 'はちみつ', '大豆': '大豆', '低於 150 大卡': '150 kcal 未満', '低於 300 大卡': '300 kcal 未満', '低咖啡因': 'カフェイン控えめ', '無咖啡因': 'カフェインなし', '套用偏好': '好みを適用',
    '慢慢選，總會找到喜歡的那一杯。': 'ゆっくり選べば、きっと好きな一杯が見つかります。', '大家都在喝': 'みんなが飲んでいる', '什麼': 'ドリンク', '看看最近最受歡迎的飲品，找一杯你的下一個喜歡。': '人気のドリンクから、次のお気に入りを見つけましょう。', '↻ 更新排行': '↻ ランキング更新', '↻ 更新中': '↻ 更新中', 'POPULAR THIS WEEK': '今週の人気', '本週人氣': '今週の人気', '人氣冠軍': '人気No.1', '清爽推薦': 'さっぱり系', '經典不敗': '定番', '果香系': 'フルーティー', '酸甜平衡': '甘酸っぱい', '無奶推薦': 'ミルク不使用', '療癒系': '癒やし系', '酸甜果茶': '甘酸っぱいフルーツティー', '暖心推薦': 'ほっとする一杯',
    '四季春青茶': '四季春茶', '黑糖珍珠鮮奶': '黒糖タピオカミルク', '柚香翡翠': '柚子翡翠茶', '冬瓜檸檬': '冬瓜レモンティー', '蜜香紅茶': '蜜香紅茶', '芋泥波波鮮奶': 'タロイモタピオカミルク', '百香雙響炮': 'パッションフルーツダブルトッピング', '桂圓紅棗茶': 'リュウガンとナツメのお茶', '花香烏龍 · 溫潤奶香': '花香るウーロン · まろやかなミルク', '清新回甘 · 無負擔': 'すっきりした後味 · 軽やか', '濃郁黑糖 · Q 彈珍珠': '濃厚黒糖 · もちもちタピオカ', '柚子果香 · 茶韻清甜': '柚子の香り · すっきりしたお茶', '古早冬瓜 · 清新檸檬': '昔ながらの冬瓜 · さわやかなレモン', '天然蜜韻 · 純茶首選': '自然な蜂蜜の香り · ストレートティー', '綿密芋泥 · 鮮乳香醇': 'なめらかタロイモ · 濃厚ミルク', '百香果香 · 雙料口感': 'パッションフルーツ · 2種のトッピング', '桂圓棗香 · 暖心熱飲': 'リュウガンとナツメ · 温かい一杯',
    '飲品': 'ドリンク', '新鮮事': '新着情報', '新品、店家消息與茶飲靈感，最近都在這裡。': '新商品やお店の話題、お茶のアイデアをお届けします。', '桂花季來了，秋天的茶香正好': '金木犀の季節、秋のお茶を楽しもう', '從窨製烏龍到桂花蜜飲，認識這個季節最迷人的花香滋味。': '香り付けしたウーロンから桂花ハニーティーまで、季節の花の香りを楽しみましょう。', '茶感編輯室 · 風味專題': 'Tea Sense 編集部 · 風味特集', '手炒黑糖的新喝法：搭配清焙烏龍': '手作り黒糖と軽焙煎ウーロンの新しい組み合わせ', '濃郁黑糖與焙火茶韻相遇，甜而不膩的新組合值得一試。': '濃厚な黒糖と焙煎茶の香ばしさ。甘すぎない新しい組み合わせです。', '飲品情報 · 新品觀察': 'ドリンク情報 · 新商品', '午後想少一點咖啡因，可以怎麼選？': '午後のカフェインを控えたいときの選び方', '認識花草茶與低咖啡因茶飲，為午後留一點剛好的清醒。': 'ハーブティーや低カフェインのお茶で、午後にちょうどいい気分転換を。', '茶感編輯室 · 日常茶知識': 'Tea Sense 編集部 · お茶の基礎', '巷子裡的製茶小店，把茶做得很日常': '街角の小さなお茶屋さん、日常に寄り添う一杯', '從產地到手沖，用一杯茶認識小店的風味故事。': '産地からハンドドリップまで、一杯のお茶でお店の物語を。', '街角散步 · 店家故事': '街角さんぽ · お店の物語', '展示用文章為原型內容；正式上線時請串接授權的新聞與店家來源。': '記事はサンプルです。公開時は許諾を得たニュースや店舗情報を接続してください。',
    '巷口的': '近所の', '好茶': 'おいしいお茶', '找到附近值得停下來的飲料店。': '立ち寄りたくなる近くのお店を見つけましょう。', '附近飲料店': '近くのティーショップ', '使用目前位置探索周邊': '現在地から近くを探す', '⌖ 使用目前位置': '⌖ 現在地を使う', '示意街區地圖': '街のイメージマップ', '青禾茶室': '青禾茶房', '山日子茶飲': '山日子ティー', '小島製茶': '島茶製茶所', '示意地圖': 'イメージマップ', '店家位置目前為示意資料。定位需在 HTTPS 或 localhost 下由你明確授權。': '店舗の位置はサンプルです。位置情報はHTTPSまたはlocalhostで、許可した場合のみ使用します。', '附近推薦': '近くのおすすめ', 'CURATED NEARBY': '近くのお店', '手沖茶飲 · 烏龍專門': 'ハンドドリップ · ウーロン専門', '鮮奶茶 · 自家烘焙': 'ミルクティー · 自家焙煎茶', '台灣茶 · 季節限定': '台湾茶 · 季節限定', '⌖ 尋找我的位置': '⌖ 現在地を探す',
    '風味彼此': '風味が', '相遇': '出会う', '看看茶種、配料和風味之間，有哪些有趣的連結。': 'お茶やトッピング、風味のつながりを見てみましょう。', '風味關係圖': '風味マップ', '選一個節點看看相關風味': 'ノードを選んで関連する風味を見る', '風味': '風味', '配料': 'トッピング', '烏龍茶': 'ウーロン', '清香': 'さわやかな香り', '焙火': '焙煎香', '茶韻': 'お茶の余韻', '桂花': '金木犀', '奶香': 'ミルクの香り', '鮮奶': '生乳', '柑橘': '柑橘', '花香': '花の香り', '焦糖': 'キャラメル', '木質': 'ウッディ', '香氣': '香り', '回甘': '甘い余韻', '點選圖上的圓點，探索風味關聯。': 'ノードを選んで風味のつながりを探しましょう。', '目前關係圖為可互動的示意資料，可替換為 RelGT 模型輸出。': 'インタラクティブなサンプルです。将来RelGTモデルの出力に置き換えられます。',
    'WE’D LOVE TO HEAR': 'ご意見をお聞かせください', '讓茶感更好一點': 'Tea Senseをより良くするために', '遇到問題、想推薦飲料，或有任何想法都歡迎告訴我們。': '問題の報告、おすすめのドリンク、アイデアをお待ちしています。', '回饋類型': 'ご意見の種類', '推薦不符合期待': 'おすすめが合わなかった', '回報錯誤': '問題を報告', '分享飲品或店家': 'ドリンクやお店を紹介', '其他想法': 'その他', '回饋內容': 'ご意見の内容', '寫下你的想法…': 'ご意見を入力してください…', '提供回饋': 'フィードバック', '送出回饋': '送信', '關閉': '閉じる', 'YOUR SETTINGS': '設定', '個人化設定': '設定', '選擇你偏好的使用方式。': '利用方法を選んでください。', '語言': '言語', '繁體中文': '繁体字中国語', '暖白茶室': '温かな茶室', '夜間茶席': '夜の茶席', '字體大小': '文字サイズ', '小字體': '小', '中字體': '中', '大字體': '大', '儲存設定': '設定を保存', '正在為你找靈感': 'おすすめを探しています', '整理口味偏好，挑選合適的飲品…': '好みをもとにドリンクを探しています…',
    '你 · 現在': 'あなた · 今', '茶感小助手 · 現在': 'Tea Sense アシスタント · 今', '對話已重置。今天想從什麼口味開始？': '会話をクリアしました。どんな味から始めますか？',
    '可以試試洛神花茶或桂花蜜香紅茶，茶香柔和又不含咖啡因。記得確認店家的實際配方與過敏原標示喔。': 'ハイビスカスティーや桂花ハニーティーはいかがですか。カフェインは含まれません。お店の原材料とアレルギー表示をご確認ください。', '推薦無糖青茶或冷泡烏龍，清爽簡單。每家店的配方和熱量不同，點餐前可以再向店家確認。': '無糖の青茶や水出しウーロンがおすすめです。配合やカロリーはお店によって異なるため、注文前にご確認ください。', '想清爽一點的話，試試四季春青茶加一點檸檬，微糖少冰也很適合午後。': 'さっぱりしたいなら、四季春茶にレモンを少し。甘さ控えめ、氷少なめが午後にぴったりです。', '一杯桂花烏龍鮮奶茶很適合好心情：烏龍茶香搭配淡淡花香，建議微糖少冰。': '気分のいい日には桂花ウーロンミルクティーはいかがですか。甘さ控えめ、氷少なめがおすすめです。', '收到！依照你的想法，我會先從清爽茶飲開始找。你也可以告訴我想要的甜度、茶種，或需要避開的食材。': 'わかりました。まずはさっぱりしたお茶から探します。甘さや茶種、避けたい食材も教えてください。', '我找到一些飲品方向，告訴我更多偏好就能幫你縮小選擇。': 'いくつか候補があります。好みを教えていただければ、さらに絞り込めます。', '目前暫時無法連線到推薦服務，請稍後再試。你仍可使用偏好選擇與其他展示頁面。': '現在おすすめサービスに接続できません。しばらくしてから再度お試しください。他のページはご利用いただけます。', '↻ 更新排行': '↻ ランキング更新', '↻ 更新中': '↻ 更新中', '已更新展示排行': 'サンプルランキングを更新しました', '對話已重置': '会話をクリアしました', '已清除偏好條件': '好みの条件をクリアしました', '回饋已在本機示範送出；正式版需設定接收服務': 'サンプルとして送信しました。正式版には受信サービスの設定が必要です', '設定已套用': '設定を適用しました', '已套用 {count} 項偏好': '{count}件の好みを適用しました',
    '此瀏覽器不支援定位，顯示示意店家': 'このブラウザーは位置情報に対応していません。サンプル店舗を表示します。', '瀏覽器目前不支援定位': 'このブラウザーは位置情報に対応していません。', '正在取得位置…': '位置情報を取得しています…', '已取得位置 {lat}, {lon}；店家仍為示意資料': '位置を取得しました {lat}, {lon}。店舗はサンプルです。', '定位成功；串接地圖資料後即可搜尋附近店家': '位置を取得しました。地図データ接続後に近くのお店を検索できます。', '你尚未授權定位，顯示示意店家': '位置情報の許可がありません。サンプル店舗を表示します。', '目前無法取得位置，顯示示意店家': '現在地を取得できません。サンプル店舗を表示します。', '定位逾時，顯示示意店家': '位置情報の取得がタイムアウトしました。サンプル店舗を表示します。', '定位失敗，顯示示意店家': '位置情報を取得できません。サンプル店舗を表示します。', '未能取得位置，仍可瀏覽示意店家': '位置情報を利用できません。サンプル店舗をご覧いただけます。', '已選取風味節點': '風味ノードを選択しました', '正式版本可由 RelGT 模型提供關聯強度與推薦說明。': '正式版ではRelGTモデルが関連度とおすすめを提示できます。',
    '以聊天探索符合口味與需求的飲品，查看人氣推薦、消息與附近店家。': '会話で好みに合うドリンクを探し、人気商品やニュース、近くのお店をチェック。', '茶感 Tea Sense｜飲品探索': 'Tea Sense｜ドリンクを探す',
  },
  ko: {
    '探索': '둘러보기', '首頁': '홈', '人氣排行': '인기 순위', '飲品消息': '음료 소식', '附近店家': '주변 매장', '風味關係': '풍미 지도', '回饋': '의견', '對話內容': '대화 메시지', '可互動的飲品風味關係圖': '인터랙티브 음료 풍미 지도', '頁面風格': '테마',
    '主要導覽': '주요 메뉴', '茶感首頁': 'Tea Sense 홈', '今天喝什麼？': '오늘은 무엇을 마실까요?', '告訴我們你的心情': '오늘 기분을 알려주세요', '訪客模式': '게스트 모드', '個人化設定': '설정',
    '偏好設定': '설정', '開啟選單': '메뉴 열기', 'YOUR DAILY CUP': '오늘의 한 잔', '找到今天的': '오늘의', '好味道': '취향을 찾아보세요', '說說你的心情，讓我們一起找杯剛剛好的飲料。': '기분을 알려주시면 딱 맞는 음료를 함께 찾아볼게요.',
    '午後微暖': '따뜻한 오후', '適合來點清爽的': '상큼한 한 잔이 어울려요', '開啟首頁時會詢問位置權限，用於尋找附近店家；不會持續追蹤。': '홈페이지를 열 때 주변 매장을 찾기 위해 위치 권한을 요청합니다. 백그라운드에서 추적하지 않습니다.', '首頁載入時會詢問位置權限，用於附近探索': '홈페이지를 열 때 주변 탐색을 위해 위치 권한을 요청합니다.', '茶感小助手': 'Tea Sense 도우미', '隨時為你找靈感': '다음 한 잔을 추천해 드려요', '清除對話': '대화 지우기',
    '現在': '지금', '嗨！今天想喝點什麼呢？可以告訴我你的心情、口味，或是想避開的食材。': '안녕하세요! 오늘은 어떤 음료가 좋으세요? 기분이나 좋아하는 맛, 피하고 싶은 재료를 알려주세요.', '今日靈感': '오늘의 추천', '桂花烏龍鮮奶茶': '계화 우롱 밀크티', '茶香溫潤 · 微糖少冰': '은은한 차 향 · 당도 낮게, 얼음 적게',
    '快速需求': '빠른 요청', '今天有點累，想喝清爽的': '조금 피곤해서 상큼한 음료를 마시고 싶어요', '推薦低熱量的飲料': '저칼로리 음료를 추천해 주세요', '我今天心情不錯，想喝茶': '오늘 기분이 좋아서 차를 마시고 싶어요', '無咖啡因又不太甜的飲料': '무카페인에 덜 단 음료', '想喝清爽的': '상큼한 음료', '低熱量': '저칼로리', '好心情': '기분 전환', '輸入飲品需求': '음료 취향 입력', '輸入你的飲品需求…': '원하는 음료를 입력하세요…', '送出訊息': '메시지 보내기', '試試看：': '이런 요청은 어때요: ', '無咖啡因又不太甜': '무카페인, 덜 달게', '你的偏好只用來推薦': '선호 정보는 추천에만 사용됩니다',
    '今天的偏好': '오늘의 취향', '調整條件，讓推薦更貼近你。': '취향을 조정해 더 잘 맞는 추천을 받아보세요.', '熱量': '칼로리', '不限': '상관없음', '不限茶種': '차 종류 상관없음', '咖啡因': '카페인', '飲料配料': '토핑', '珍珠、椰果': '펄, 코코넛 젤리', '珍珠': '펄', '椰果': '코코넛 젤리', '仙草': '선초 젤리', '不加配料': '토핑 제외', '心情': '기분', '選擇你的心情': '기분 선택', '放鬆': '휴식', '想放鬆': '편안하게', '提振精神': '기운 내기', '開心': '행복함', '心情愉快': '기분 좋음', '茶種': '차 종류', '烏龍茶': '우롱차', '紅茶': '홍차', '綠茶': '녹차', '花草茶': '허브차', '過敏原': '알레르기 유발 성분', '尚未設定': '설정 안 됨', '乳製品': '유제품', '堅果': '견과류', '蜂蜜': '꿀', '大豆': '대두', '低於 150 大卡': '150 kcal 미만', '低於 300 大卡': '300 kcal 미만', '低咖啡因': '저카페인', '無咖啡因': '무카페인', '套用偏好': '취향 적용',
    '慢慢選，總會找到喜歡的那一杯。': '천천히 골라보세요. 마음에 드는 한 잔을 찾을 수 있어요.', '大家都在喝': '요즘 인기 있는 ', '什麼': '음료', '看看最近最受歡迎的飲品，找一杯你的下一個喜歡。': '요즘 인기 음료를 살펴보고 다음 취향을 찾아보세요.', '↻ 更新排行': '↻ 순위 새로고침', '↻ 更新中': '↻ 업데이트 중', 'POPULAR THIS WEEK': '이번 주 인기', '本週人氣': '이번 주 인기', '人氣冠軍': '가장 인기', '清爽推薦': '상큼 추천', '經典不敗': '클래식', '果香系': '과일 향', '酸甜平衡': '새콤달콤', '無奶推薦': '유제품 제외', '療癒系': '힐링', '酸甜果茶': '새콤달콤 과일차', '暖心推薦': '따뜻한 추천',
    '四季春青茶': '사계춘 녹차', '黑糖珍珠鮮奶': '흑당 펄 밀크티', '柚香翡翠': '유자 비취차', '冬瓜檸檬': '동과 레몬티', '蜜香紅茶': '꿀향 홍차', '芋泥波波鮮奶': '타로 펄 밀크티', '百香雙響炮': '패션프루트 더블 토핑티', '桂圓紅棗茶': '용안 대추차', '花香烏龍 · 溫潤奶香': '꽃향 우롱 · 부드러운 우유 향', '清新回甘 · 無負擔': '깔끔한 뒷맛 · 가볍게', '濃郁黑糖 · Q 彈珍珠': '진한 흑당 · 쫄깃한 펄', '柚子果香 · 茶韻清甜': '유자 향 · 산뜻한 차 맛', '古早冬瓜 · 清新檸檬': '전통 동과 · 상큼한 레몬', '天然蜜韻 · 純茶首選': '자연스러운 꿀 향 · 기본 홍차', '綿密芋泥 · 鮮乳香醇': '부드러운 토란 · 고소한 우유', '百香果香 · 雙料口感': '패션프루트 · 두 가지 토핑', '桂圓棗香 · 暖心熱飲': '용안과 대추 · 따뜻한 차',
    '飲品': '음료', '新鮮事': '새로운 소식', '新品、店家消息與茶飲靈感，最近都在這裡。': '신메뉴와 매장 소식, 차에 관한 아이디어를 만나보세요.', '桂花季來了，秋天的茶香正好': '계화 시즌, 가을 차 향을 즐겨보세요', '從窨製烏龍到桂花蜜飲，認識這個季節最迷人的花香滋味。': '향을 입힌 우롱차부터 계화 꿀차까지, 계절의 꽃 향을 만나보세요.', '茶感編輯室 · 風味專題': 'Tea Sense 편집팀 · 풍미 이야기', '手炒黑糖的新喝法：搭配清焙烏龍': '수제 흑당과 가볍게 볶은 우롱의 새로운 조합', '濃郁黑糖與焙火茶韻相遇，甜而不膩的新組合值得一試。': '진한 흑당과 볶은 차 향이 만나 달콤하지만 부담스럽지 않아요.', '飲品情報 · 新品觀察': '음료 소식 · 신메뉴', '午後想少一點咖啡因，可以怎麼選？': '오후에 카페인을 줄이고 싶다면?', '認識花草茶與低咖啡因茶飲，為午後留一點剛好的清醒。': '허브차와 저카페인 차로 오후에 기분 좋은 활력을 더해보세요.', '茶感編輯室 · 日常茶知識': 'Tea Sense 편집팀 · 차 이야기', '巷子裡的製茶小店，把茶做得很日常': '골목의 작은 찻집, 일상에서 즐기는 차', '從產地到手沖，用一杯茶認識小店的風味故事。': '산지에서 핸드드립까지, 한 잔에 담긴 가게 이야기를 만나보세요.', '街角散步 · 店家故事': '골목 산책 · 매장 이야기', '展示用文章為原型內容；正式上線時請串接授權的新聞與店家來源。': '샘플 기사입니다. 정식 출시 전 승인된 뉴스와 매장 정보를 연결하세요.',
    '巷口的': '동네의', '好茶': '좋은 차', '找到附近值得停下來的飲料店。': '잠시 들르고 싶은 주변 음료 매장을 찾아보세요.', '附近飲料店': '주변 찻집', '使用目前位置探索周邊': '현재 위치로 주변 둘러보기', '⌖ 使用目前位置': '⌖ 현재 위치 사용', '示意街區地圖': '동네 예시 지도', '青禾茶室': '청하 티룸', '山日子茶飲': '산날 티', '小島製茶': '작은 섬 차공방', '示意地圖': '예시 지도', '店家位置目前為示意資料。定位需在 HTTPS 或 localhost 下由你明確授權。': '매장 위치는 예시입니다. 위치 정보는 HTTPS 또는 localhost에서 동의한 경우에만 사용합니다.', '附近推薦': '주변 추천', 'CURATED NEARBY': '엄선한 주변 매장', '手沖茶飲 · 烏龍專門': '핸드드립 차 · 우롱 전문', '鮮奶茶 · 自家烘焙': '밀크티 · 직접 로스팅한 차', '台灣茶 · 季節限定': '대만 차 · 계절 한정', '⌖ 尋找我的位置': '⌖ 내 위치 찾기',
    '風味彼此': '풍미가', '相遇': '만나는 곳', '看看茶種、配料和風味之間，有哪些有趣的連結。': '차와 토핑, 풍미 사이의 재미있는 연결을 살펴보세요.', '風味關係圖': '풍미 지도', '選一個節點看看相關風味': '노드를 선택해 관련 풍미를 확인하세요', '風味': '풍미', '配料': '토핑', '烏龍茶': '우롱차', '清香': '산뜻한 향', '焙火': '볶은 향', '茶韻': '차의 여운', '桂花': '계화', '奶香': '우유 향', '鮮奶': '생우유', '柑橘': '감귤', '花香': '꽃 향', '焦糖': '캐러멜', '木質': '우디', '香氣': '향기', '回甘': '달콤한 여운', '點選圖上的圓點，探索風味關聯。': '노드를 선택해 풍미의 연결을 살펴보세요.', '目前關係圖為可互動的示意資料，可替換為 RelGT 模型輸出。': '인터랙티브 예시입니다. 추후 RelGT 모델 결과로 대체할 수 있습니다.',
    'WE’D LOVE TO HEAR': '여러분의 의견을 들려주세요', '讓茶感更好一點': '더 나은 Tea Sense를 위해', '遇到問題、想推薦飲料，或有任何想法都歡迎告訴我們。': '문제 신고, 음료 추천, 아이디어를 보내주세요.', '回饋類型': '의견 유형', '推薦不符合期待': '추천이 마음에 들지 않아요', '回報錯誤': '문제 신고', '分享飲品或店家': '음료나 매장 소개', '其他想法': '기타 의견', '回饋內容': '의견 내용', '寫下你的想法…': '의견을 입력하세요…', '提供回饋': '의견 보내기', '送出回饋': '제출', '關閉': '닫기', 'YOUR SETTINGS': '설정', '個人化設定': '설정', '選擇你偏好的使用方式。': '원하는 사용 방식을 선택하세요.', '語言': '언어', '繁體中文': '중국어(번체)', '暖白茶室': '따뜻한 티룸', '夜間茶席': '저녁 티룸', '字體大小': '글자 크기', '小字體': '작게', '中字體': '보통', '大字體': '크게', '儲存設定': '설정 저장', '正在為你找靈感': '추천을 찾고 있어요', '整理口味偏好，挑選合適的飲品…': '취향을 바탕으로 음료를 찾는 중…',
    '你 · 現在': '나 · 지금', '茶感小助手 · 現在': 'Tea Sense 도우미 · 지금', '對話已重置。今天想從什麼口味開始？': '대화를 지웠어요. 어떤 맛부터 시작할까요?',
    '可以試試洛神花茶或桂花蜜香紅茶，茶香柔和又不含咖啡因。記得確認店家的實際配方與過敏原標示喔。': '히비스커스차나 계화 꿀 홍차를 추천해요. 카페인이 없고 향이 부드러워요. 매장의 재료와 알레르기 표시를 확인하세요.', '推薦無糖青茶或冷泡烏龍，清爽簡單。每家店的配方和熱量不同，點餐前可以再向店家確認。': '무가당 청차나 콜드브루 우롱을 추천해요. 매장마다 레시피와 칼로리가 다르니 주문 전에 확인해 주세요.', '想清爽一點的話，試試四季春青茶加一點檸檬，微糖少冰也很適合午後。': '상큼한 음료를 원한다면 사계춘차에 레몬을 더해보세요. 당도와 얼음을 적게 하면 오후에 잘 어울려요.', '一杯桂花烏龍鮮奶茶很適合好心情：烏龍茶香搭配淡淡花香，建議微糖少冰。': '기분 좋은 날엔 계화 우롱 밀크티를 추천해요. 은은한 꽃 향이 어우러져요. 당도와 얼음은 적게 드셔보세요.', '收到！依照你的想法，我會先從清爽茶飲開始找。你也可以告訴我想要的甜度、茶種，或需要避開的食材。': '좋아요! 우선 상큼한 차 음료부터 찾아볼게요. 원하는 당도와 차 종류, 피하고 싶은 재료도 알려주세요.', '我找到一些飲品方向，告訴我更多偏好就能幫你縮小選擇。': '몇 가지 음료를 찾았어요. 취향을 더 알려주시면 선택지를 좁혀볼게요.', '目前暫時無法連線到推薦服務，請稍後再試。你仍可使用偏好選擇與其他展示頁面。': '현재 추천 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요. 취향 선택과 다른 페이지는 이용할 수 있어요.', '↻ 更新排行': '↻ 순위 새로고침', '↻ 更新中': '↻ 업데이트 중', '已更新展示排行': '예시 순위를 업데이트했어요', '對話已重置': '대화를 지웠어요', '已清除偏好條件': '취향 조건을 지웠어요', '回饋已在本機示範送出；正式版需設定接收服務': '예시로 의견을 제출했어요. 정식 버전에는 수신 서비스가 필요합니다', '設定已套用': '설정을 적용했어요', '已套用 {count} 項偏好': '취향 {count}개를 적용했어요',
    '此瀏覽器不支援定位，顯示示意店家': '이 브라우저는 위치 정보를 지원하지 않습니다. 예시 매장을 표시합니다.', '瀏覽器目前不支援定位': '이 브라우저는 위치 정보를 지원하지 않습니다.', '正在取得位置…': '현재 위치를 확인 중…', '已取得位置 {lat}, {lon}；店家仍為示意資料': '위치를 확인했어요: {lat}, {lon}. 매장 정보는 예시입니다.', '定位成功；串接地圖資料後即可搜尋附近店家': '위치를 확인했어요. 지도 데이터를 연결하면 주변 매장을 검색할 수 있습니다.', '你尚未授權定位，顯示示意店家': '위치 권한이 없습니다. 예시 매장을 표시합니다.', '目前無法取得位置，顯示示意店家': '현재 위치를 확인할 수 없습니다. 예시 매장을 표시합니다.', '定位逾時，顯示示意店家': '위치 확인 시간이 초과되었습니다. 예시 매장을 표시합니다.', '定位失敗，顯示示意店家': '위치를 확인할 수 없습니다. 예시 매장을 표시합니다.', '未能取得位置，仍可瀏覽示意店家': '위치를 확인할 수 없습니다. 예시 매장은 볼 수 있어요.', '已選取風味節點': '풍미 노드를 선택했어요', '正式版本可由 RelGT 模型提供關聯強度與推薦說明。': '정식 버전에서는 RelGT 모델이 연관도와 추천 설명을 제공할 수 있습니다.',
    '以聊天探索符合口味與需求的飲品，查看人氣推薦、消息與附近店家。': '대화로 취향에 맞는 음료를 찾고 인기 메뉴, 소식, 주변 매장을 확인하세요.', '茶感 Tea Sense｜飲品探索': 'Tea Sense | 음료 찾기',
  },
};

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
  renderRanking();
  renderNews();
  renderPlaces();
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
  { name: '桂花烏龍鮮奶茶', detail: '花香烏龍 · 溫潤奶香', emoji: '🧋', votes: '2,480', tag: '人氣冠軍' },
  { name: '四季春青茶', detail: '清新回甘 · 無負擔', emoji: '🍵', votes: '1,926', tag: '清爽推薦' },
  { name: '黑糖珍珠鮮奶', detail: '濃郁黑糖 · Q 彈珍珠', emoji: '🥤', votes: '1,674', tag: '經典不敗' },
  { name: '柚香翡翠', detail: '柚子果香 · 茶韻清甜', emoji: '🍋', votes: '1,438', tag: '果香系' },
  { name: '冬瓜檸檬', detail: '古早冬瓜 · 清新檸檬', emoji: '🍹', votes: '1,209', tag: '酸甜平衡' },
  { name: '蜜香紅茶', detail: '天然蜜韻 · 純茶首選', emoji: '🫖', votes: '986', tag: '無奶推薦' },
  { name: '芋泥波波鮮奶', detail: '綿密芋泥 · 鮮乳香醇', emoji: '🥛', votes: '854', tag: '療癒系' },
  { name: '百香雙響炮', detail: '百香果香 · 雙料口感', emoji: '🍊', votes: '726', tag: '酸甜果茶' },
  { name: '桂圓紅棗茶', detail: '桂圓棗香 · 暖心熱飲', emoji: '☕', votes: '613', tag: '暖心推薦' },
];
function renderRanking(list = drinks) {
  document.querySelector('#rankingGrid').innerHTML = list.map((drink, index) => `<article class="rank-item"><span class="rank-number">${String(index + 1).padStart(2, '0')}</span><span class="rank-emoji" aria-hidden="true">${drink.emoji}</span><div class="rank-copy"><strong>${t(drink.name)}</strong><small>${t(drink.detail)}</small></div><span class="rank-tag">${t(drink.tag)}</span><span class="rank-votes">♡ ${drink.votes}</span></article>`).join('');
}
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
    renderRanking([...drinks.slice(1, 3), drinks[0], ...drinks.slice(3)]);
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
  { name: '青禾茶室', type: '手沖茶飲 · 烏龍專門', distance: '350 m', emoji: '🍵' },
  { name: '山日子茶飲', type: '鮮奶茶 · 自家烘焙', distance: '650 m', emoji: '🧋' },
  { name: '小島製茶', type: '台灣茶 · 季節限定', distance: '900 m', emoji: '🫖' },
];
function renderPlaces() {
  document.querySelector('#placeList').innerHTML = places.map(place => `<div class="place-row"><span class="place-thumb" aria-hidden="true">${place.emoji}</span><span class="place-copy"><strong>${t(place.name)}</strong><small>${t(place.type)}</small></span><span class="place-distance">${place.distance}</span></div>`).join('');
}
renderPlaces();
function locate({ automatic = false } = {}) {
  const status = document.querySelector('#locationStatus');
  if (!navigator.geolocation) {
    status.textContent = t('此瀏覽器不支援定位，顯示示意店家');
    if (!automatic) showToast(t('瀏覽器目前不支援定位'));
    return;
  }
  status.textContent = t('正在取得位置…');
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      status.textContent = t('已取得位置 {lat}, {lon}；店家仍為示意資料', { lat: latitude.toFixed(3), lon: longitude.toFixed(3) });
      if (!automatic) showToast(t('定位成功；串接地圖資料後即可搜尋附近店家'));
    },
    error => {
      const messages = { 1: '你尚未授權定位，顯示示意店家', 2: '目前無法取得位置，顯示示意店家', 3: '定位逾時，顯示示意店家' };
      status.textContent = t(messages[error.code] || '定位失敗，顯示示意店家');
      if (!automatic) showToast(t('未能取得位置，仍可瀏覽示意店家'));
    }, { enableHighAccuracy: false, timeout: 9000, maximumAge: 60000 },
  );
}
document.querySelector('#locateButton').addEventListener('click', locate);
document.querySelector('#locateFromList').addEventListener('click', locate);

document.querySelectorAll('.graph-node').forEach(node => node.addEventListener('click', () => {
  const name = t(node.dataset.name);
  const related = [...node.parentElement.children].filter(other => other !== node && other.classList.contains('graph-node'));
  document.querySelectorAll('.graph-node').forEach(other => other.classList.toggle('dim', other !== node && !related.includes(other)));
  document.querySelectorAll('.graph-node').forEach(other => other.classList.toggle('selected', other === node));
  document.querySelector('#graphDetail').textContent = `${name}: ${t('已選取風味節點')}。${t('正式版本可由 RelGT 模型提供關聯強度與推薦說明。')}`;
}));

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
  body.append(meta, bubble); wrapper.append(body);
  document.querySelector('#chatMessages').append(wrapper);
  wrapper.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
async function sendMessage(text) {
  const cleaned = text.trim();
  if (!cleaned) return;
  addMessage(cleaned, 'user');
  document.querySelector('#chatInput').value = '';
  const modal = document.querySelector('#loadingModal');
  modal.showModal();
  try {
    const intent = await services.understand(cleaned, getPreferences());
    const answer = await services.reply({ text: cleaned, preferences: getPreferences(), intent, history: [], language: currentLocale });
    setTimeout(() => {
      modal.close();
      addMessage(typeof answer === 'string' ? answer : (answer.reply || answer.text || t('我找到一些飲品方向，告訴我更多偏好就能幫你縮小選擇。')), 'assistant');
    }, 650);
  } catch (error) {
    modal.close();
    addMessage(t('目前暫時無法連線到推薦服務，請稍後再試。你仍可使用偏好選擇與其他展示頁面。'), 'assistant');
    console.error('Recommendation service error:', error);
  }
}
document.querySelector('#chatForm').addEventListener('submit', event => { event.preventDefault(); sendMessage(document.querySelector('#chatInput').value); });
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => sendMessage(button.dataset.prompt)));
function clearChat() {
  const messages = document.querySelector('#chatMessages');
  messages.replaceChildren();
  addMessage(t('對話已重置。今天想從什麼口味開始？'), 'assistant');
  showToast(t('對話已重置'));
}
document.querySelector('#clearChat').addEventListener('click', clearChat);
document.querySelectorAll('.preference-options input').forEach(input => input.addEventListener('change', () => {
  syncPreferenceLabels();
}));
document.querySelector('#applyPreferences').addEventListener('click', () => {
  const preferences = getPreferences();
  showToast(preferences.length ? t('已套用 {count} 項偏好', { count: preferences.length }) : t('已清除偏好條件'));
});

const feedbackModal = document.querySelector('#feedbackModal');
document.querySelector('#feedbackButton').addEventListener('click', () => feedbackModal.showModal());
document.querySelectorAll('[data-close-dialog]').forEach(button => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});
document.querySelector('#feedbackForm').addEventListener('submit', event => {
  event.preventDefault();
  feedbackModal.close();
  event.currentTarget.reset();
  showToast('回饋已在本機示範送出；正式版需設定接收服務');
});

const preferencesModal = document.querySelector('#preferencesModal');
document.querySelector('#preferencesButton').addEventListener('click', () => preferencesModal.showModal());
document.querySelector('#profileButton').addEventListener('click', () => preferencesModal.showModal());
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
  } catch { /* Settings remain active for this session. */ }
  preferencesModal.close();
  showToast(t('設定已套用'));
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
let savedFontSize = 'medium';
try {
  const storedFontSize = localStorage.getItem('teaSenseFontSize');
  if (storedFontSize && Object.hasOwn(fontSizeScales, storedFontSize)) savedFontSize = storedFontSize;
} catch { /* Use medium text when browser storage is unavailable. */ }
applyFontSize(savedFontSize);
if (document.body.dataset.currentPage === 'home') locate({ automatic: true });
