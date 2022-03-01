const blocks = {
  "nodes": [
	 {"id":1, "name": "Cooking"}
	,{"id":2, "name": "Food"}
	,{"id":3, "name": "Eating"}
	,{"id":4, "name": "Cook"}
	,{"id":5, "name": "Life"}
	,{"id":6, "name": "Energy"}
	,{"id":7, "name": "Heat"}
	,{"id":8, "name": "Manual labor"}
	,{"id":9, "name": "Definition"}
	,{"id":10, "name": "Dish"}
	,{"id":11, "name": "Culture"}
	,{"id":12, "name": "Others"}
	,{"id":13, "name": "Self"}
	,{"id":14, "name": "Styles"}
	,{"id":15, "name": "vegan"}
	,{"id":16, "name": "vegetarian"}
	,{"id":17, "name": "pescetarian"}
	,{"id":18, "name": "meaty"}
	,{"id":19, "name": "Ingrediens"}
	,{"id":20, "name": "Region"}
	,{"id":21, "name": "Climate/Season"}
	,{"id":22, "name": "Social gathering"}
	,{"id":23, "name": "Easter"}
	,{"id":24, "name": "Christmas"}
	,{"id":25, "name": "Thanksgiving"}
	,{"id":26, "name": "BBQ"}
	,{"id":27, "name": "Insects"}
	,{"id":28, "name": "Land animals"}
	,{"id":29, "name": "Aquatic animals"}
	,{"id":30, "name": "Plants"}
  ],
  "links": [
	 {"source": "Food", "target": "Cooking", "content": "is the preparation of"}
	,{"source": "Eating", "target": "Food", "content": "ingestion of"}
	,{"source": "Cook", "target": "Cooking", "content": "profession of"}
	,{"source": "Eating", "target": "Life", "content": "essential to"}
	,{"source": "Eating", "target": "Energy", "content": "form of"}
	,{"source": "Energy", "target": "Cooking", "content": "needed for"}
	,{"source": "Energy", "target": "Manual labor", "content": "in the form of"}
	,{"source": "Energy", "target": "Heat", "content": "in the form of"}
	,{"source": "Cooking", "target": "Definition", "content": "is"}
	,{"source": "Cooking", "target": "Others", "content": "for"}
	,{"source": "Cooking", "target": "Self", "content": "for"}
	,{"source": "Food", "target": "Culture", "content": "part of"}
	,{"source": "Dish", "target": "Styles", "content": "there are different"}
	,{"source": "Others", "target": "Styles", "content": "preferences in"}
	,{"source": "Styles", "target": "vegan", "content": "like"}
	,{"source": "Styles", "target": "vegetarian", "content": "like"}
	,{"source": "Styles", "target": "pescetarian", "content": "like"}
	,{"source": "Styles", "target": "meaty", "content": "like"}
	,{"source": "Ingrediens", "target": "Cooking", "content": "used for"}
	,{"source": "Ingrediens", "target": "Dish", "content": "make up"}
	,{"source": "Ingrediens", "target": "Region", "content": "vary by"}
	,{"source": "Ingrediens", "target": "Climate/Season", "content": "vary by"}
	,{"source": "Others", "target": "Social gathering", "content": "participate"}
	,{"source": "Social gathering", "target": "Easter", "content": "like"}
	,{"source": "Social gathering", "target": "Christmas", "content": "like"}
	,{"source": "Social gathering", "target": "Thanksgiving", "content": "like"}
	,{"source": "Social gathering", "target": "BBQ", "content": "like"}
	,{"source": "Cooking", "target": "Social gathering", "content": "can be a form of"}
	,{"source": "Culture", "target": "Dish", "content": "each has distinct"}
	,{"source": "Social gathering", "target": "Culture", "content": "plays big part of"}
	,{"source": "Climate/Season", "target": "Social gathering", "content": "can have different"}
	,{"source": "Climate/Season", "target": "Dish", "content": "can have different"}
	,{"source": "Ingrediens", "target": "Insects", "content": "sourced from"}
	,{"source": "Ingrediens", "target": "Insects", "content": "sourced from"}
	,{"source": "Ingrediens", "target": "Land animals", "content": "sourced from"}
	,{"source": "Ingrediens", "target": "Aquatic animals", "content": "sourced from"}
	,{"source": "Ingrediens", "target": "Plants", "content": "sourced from"}
	,{"source": "meaty", "target": "Insects", "content": "can contain"}
	,{"source": "meaty", "target": "Land animals", "content": "can contain"}
	,{"source": "meaty", "target": "Aquatic animals", "content": "can contain"}
	,{"source": "vegan", "target": "Plants", "content": "using only"}
	,{"source": "vegetarian", "target": "Aquatic animals", "content": "can be sourced from"}
	,{"source": "vegetarian", "target": "Land animals", "content": "can be sourced from"}
	,{"source": "vegetarian", "target": "Plants", "content": "mostly"}
	,{"source": "pescetarian", "target": "Plants", "content": "can contain"}
  ]
}

export default blocks;