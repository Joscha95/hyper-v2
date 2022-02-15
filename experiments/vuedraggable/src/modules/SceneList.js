class SceneList {
  constructor(list) {
    this.list=list || [];
  }

  addItem(item){
    this.list.push(item);
  }
}

export{SceneList}