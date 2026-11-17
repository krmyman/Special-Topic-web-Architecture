/* Shared illustrative catalog consumed by ranking, recommendations and flavor map. */
window.TEA_SENSE_DATA = {
  schemaVersion: 1,
  drinks: [
    { id:'osmanthus-oolong-milk', name:'桂花烏龍鮮奶茶', category:'milk', teaType:'烏龍茶', detail:'花香烏龍 · 溫潤奶香', flavors:['桂花','花香','茶韻','奶香'], toppings:[], ingredients:['茶','鮮奶','桂花'], allergens:['乳製品'], caffeine:'high', caffeineLabel:'含咖啡因', nutrition:{caloriesMin:250,caloriesMax:350,label:'約 250–350 大卡'}, sweetness:'微糖少冰', reason:'烏龍茶韻搭配桂花香，風味柔和飽滿。', adjustment:'可選無糖或少冰，並向店家確認奶類替代品。', emoji:'🧋', votes:'2,480', tag:'人氣冠軍' },
    { id:'four-seasons-green', name:'四季春青茶', category:'tea', teaType:'綠茶', detail:'清新回甘 · 無負擔', flavors:['清香','清爽','回甘'], toppings:[], ingredients:['茶'], allergens:[], caffeine:'medium', caffeineLabel:'含咖啡因', nutrition:{caloriesMin:0,caloriesMax:80,label:'約 0–80 大卡'}, sweetness:'無糖少冰', reason:'清爽茶感明亮，適合作為輕盈選擇。', adjustment:'可加檸檬片；熱量依店家配方而異。', emoji:'🍵', votes:'1,926', tag:'清爽推薦' },
    { id:'brown-sugar-boba-milk', name:'黑糖珍珠鮮奶', category:'milk', teaType:'其他', detail:'濃郁黑糖 · Q 彈珍珠', flavors:['焦糖','奶香'], toppings:['珍珠'], ingredients:['鮮奶','黑糖','珍珠'], allergens:['乳製品'], caffeine:'none', caffeineLabel:'通常不含咖啡因', nutrition:{caloriesMin:350,caloriesMax:550,label:'約 350–550 大卡'}, sweetness:'建議微糖少冰', reason:'黑糖香氣濃厚，搭配珍珠口感豐富。', adjustment:'可選少糖或不加珍珠。', emoji:'🥤', votes:'1,674', tag:'經典不敗' },
    { id:'yuzu-jade', name:'柚香翡翠', category:'fruit', teaType:'綠茶', detail:'柚子果香 · 茶韻清甜', flavors:['柑橘','清香'], toppings:[], ingredients:['茶','柚子'], allergens:[], caffeine:'medium', caffeineLabel:'含咖啡因', nutrition:{caloriesMin:null,caloriesMax:null,label:'依配方而異'}, sweetness:'微糖少冰', reason:'柚子果香帶出清爽茶韻。', adjustment:'可選無糖，糖漿配方請向店家確認。', emoji:'🍋', votes:'1,438', tag:'果香系' },
    { id:'wintermelon-lemon', name:'冬瓜檸檬', category:'fruit', teaType:'其他', detail:'古早冬瓜 · 清新檸檬', flavors:['柑橘','清爽'], toppings:[], ingredients:['冬瓜','檸檬'], allergens:[], caffeine:'none', caffeineLabel:'通常不含咖啡因', nutrition:{caloriesMin:null,caloriesMax:null,label:'依配方而異'}, sweetness:'微糖少冰', reason:'檸檬酸香平衡冬瓜甜味。', adjustment:'可詢問冬瓜露含糖量。', emoji:'🍹', votes:'1,209', tag:'酸甜平衡' },
    { id:'honey-black-tea', name:'蜜香紅茶', category:'tea', teaType:'紅茶', detail:'天然蜜韻 · 純茶首選', flavors:['蜂蜜','茶韻','木質'], toppings:[], ingredients:['茶','蜂蜜香氣'], allergens:[], caffeine:'high', caffeineLabel:'含咖啡因', nutrition:{caloriesMin:0,caloriesMax:100,label:'約 0–100 大卡'}, sweetness:'無糖', reason:'蜜香與紅茶茶韻清楚，適合純茶愛好者。', adjustment:'「蜜香」描述風味，不代表加入蜂蜜；仍請確認配方。', emoji:'🫖', votes:'986', tag:'無奶推薦' },
    { id:'taro-boba-milk', name:'芋泥波波鮮奶', category:'milk', teaType:'其他', detail:'綿密芋泥 · 鮮乳香醇', flavors:['奶香','焦糖'], toppings:['珍珠'], ingredients:['鮮奶','芋頭','珍珠'], allergens:['乳製品'], caffeine:'none', caffeineLabel:'通常不含咖啡因', nutrition:{caloriesMin:null,caloriesMax:null,label:'依配方而異'}, sweetness:'建議微糖', reason:'芋泥綿密、奶香濃郁，口感厚實。', adjustment:'可詢問減糖或不加配料。', emoji:'🥛', votes:'854', tag:'療癒系' },
    { id:'passionfruit-double', name:'百香雙響炮', category:'fruit', teaType:'綠茶', detail:'百香果香 · 雙料口感', flavors:['柑橘','清爽'], toppings:['珍珠','椰果'], ingredients:['茶','百香果','珍珠','椰果'], allergens:[], caffeine:'medium', caffeineLabel:'含咖啡因', nutrition:{caloriesMin:null,caloriesMax:null,label:'依配方而異'}, sweetness:'微糖少冰', reason:'果香鮮明，雙配料提供多層口感。', adjustment:'可減少一種配料或調低甜度。', emoji:'🍊', votes:'726', tag:'酸甜果茶' },
    { id:'longan-jujube', name:'桂圓紅棗茶', category:'other', teaType:'花草茶', detail:'桂圓棗香 · 暖心熱飲', flavors:['果甜','暖香'], toppings:[], ingredients:['桂圓','紅棗'], allergens:[], caffeine:'none', caffeineLabel:'通常不含咖啡因', nutrition:{caloriesMin:null,caloriesMax:null,label:'依配方而異'}, sweetness:'建議無額外加糖', reason:'桂圓與紅棗帶出溫潤果甜香氣。', adjustment:'確認店家是否額外加糖。', emoji:'☕', votes:'613', tag:'暖心推薦' },
  ],
  places: [
    { id:'green-grain', name:'青禾茶室', type:'手沖茶飲 · 烏龍專門', category:'茶飲', distanceMeters:350, open:true, emoji:'🍵' },
    { id:'mountain-day', name:'山日子茶飲', type:'鮮奶茶 · 自家烘焙', category:'奶茶', distanceMeters:650, open:true, emoji:'🧋' },
    { id:'island-tea', name:'小島製茶', type:'台灣茶 · 季節限定', category:'茶飲', distanceMeters:900, open:false, emoji:'🫖' },
  ],
  graphConnections: { '烏龍茶':['清香','焙火','茶韻','桂花','奶香'], '清香':['烏龍茶','柑橘','花香'], '焙火':['烏龍茶','焦糖','木質'], '茶韻':['烏龍茶','回甘'], '桂花':['烏龍茶','香氣','蜂蜜'], '奶香':['烏龍茶','鮮奶','珍珠'], '柑橘':['清香'], '花香':['清香'], '焦糖':['焙火'], '木質':['焙火'], '香氣':['桂花'], '蜂蜜':['桂花'], '鮮奶':['奶香'], '珍珠':['奶香'], '回甘':['茶韻'] },
  graphDrinkMatches: { '烏龍茶':['桂花烏龍鮮奶茶','四季春青茶'], '清香':['四季春青茶','柚香翡翠'], '焙火':['黑糖珍珠鮮奶','蜜香紅茶'], '茶韻':['桂花烏龍鮮奶茶','蜜香紅茶'], '桂花':['桂花烏龍鮮奶茶'], '奶香':['桂花烏龍鮮奶茶','芋泥波波鮮奶'], '柑橘':['冬瓜檸檬','柚香翡翠'], '花香':['桂花烏龍鮮奶茶'], '焦糖':['黑糖珍珠鮮奶'], '木質':['蜜香紅茶'], '蜂蜜':['蜜香紅茶'], '鮮奶':['桂花烏龍鮮奶茶','芋泥波波鮮奶'], '珍珠':['黑糖珍珠鮮奶','百香雙響炮'], '回甘':['四季春青茶'] },
  graphEdges: [
    ['烏龍茶','清香',4],['烏龍茶','焙火',3],['烏龍茶','茶韻',4],['烏龍茶','桂花',3],['烏龍茶','奶香',2],['清香','柑橘',3],['清香','花香',4],['焙火','焦糖',4],['焙火','木質',3],['桂花','香氣',4],['桂花','蜂蜜',3],['奶香','鮮奶',4],['奶香','珍珠',2],['茶韻','回甘',3],
  ],
};

window.validateTeaSenseData = function validateTeaSenseData(data = window.TEA_SENSE_DATA) {
  const errors = [];
  if (!data || data.schemaVersion !== 1 || !Array.isArray(data.drinks)) return ['catalog schemaVersion 1 and drinks[] are required'];
  const ids = new Set();
  const categories = new Set(['tea','milk','fruit','other']);
  const caffeineLevels = new Set(['high','medium','low','none','unknown']);
  for (const [index, drink] of data.drinks.entries()) {
    const path = `drinks[${index}]`;
    for (const key of ['id','name','category','teaType','detail','flavors','toppings','ingredients','allergens','caffeine','caffeineLabel','nutrition','sweetness','reason','adjustment','emoji']) {
      if (!(key in drink)) errors.push(`${path}.${key} is required`);
    }
    if (ids.has(drink.id)) errors.push(`${path}.id must be unique`);
    ids.add(drink.id);
    if (!categories.has(drink.category)) errors.push(`${path}.category is invalid`);
    if (!caffeineLevels.has(drink.caffeine)) errors.push(`${path}.caffeine is invalid`);
    for (const key of ['flavors','toppings','ingredients','allergens']) if (!Array.isArray(drink[key])) errors.push(`${path}.${key} must be an array`);
    if (!drink.nutrition || !('caloriesMin' in drink.nutrition) || !('caloriesMax' in drink.nutrition) || !drink.nutrition.label) errors.push(`${path}.nutrition is incomplete`);
    if (drink.nutrition?.caloriesMin !== null && drink.nutrition?.caloriesMax !== null && drink.nutrition?.caloriesMin > drink.nutrition?.caloriesMax) errors.push(`${path}.nutrition calorie range is reversed`);
  }
  for (const [index, edge] of (data.graphEdges || []).entries()) {
    if (!Array.isArray(edge) || edge.length !== 3) errors.push(`graphEdges[${index}] must be [source, target, strength]`);
    else if (!(edge[0] in (data.graphConnections || {})) || !(edge[1] in (data.graphConnections || {})) || !Number.isFinite(edge[2]) || edge[2] < 1 || edge[2] > 5) errors.push(`graphEdges[${index}] has an invalid endpoint or strength`);
  }
  for (const [node, related] of Object.entries(data.graphConnections || {})) {
    if (!Array.isArray(related)) errors.push(`graphConnections.${node} must be an array`);
    else for (const target of related) if (!(target in data.graphConnections)) errors.push(`graphConnections.${node} references missing node ${target}`);
  }
  for (const [node, matches] of Object.entries(data.graphDrinkMatches || {})) {
    if (!data.graphConnections?.[node]) errors.push(`graphDrinkMatches.${node} has no graph node`);
    for (const name of matches) if (!data.drinks.some(drink => drink.name === name)) errors.push(`graphDrinkMatches.${node} references missing drink ${name}`);
  }
  return errors;
};
