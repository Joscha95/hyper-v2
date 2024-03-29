class Toolbar {
  constructor(options) {
    this.dom = document.createElement('DIV');
    this.dom.classList.add('toolbox');
    this.parent=document.querySelector('#toolbox_wrapper');
    this.fields = new Map();
    this.visible = true;

    let btn;
    options.forEach((item, i) => {
      btn=document.createElement('DIV');
      switch (item.type) {
        case 'toggle':
            btn.className= item.condition ? item.on : item.off;
            btn.title=item.condition ? item.tooltipOn : item.tooltipOff;
            btn.onclick=(e)=>{
              item.callback();
              e.stopPropagation();
            }

          break;
        default:
          btn.className=item.class;
          btn.title=item.tooltip;
          btn.onmousedown=(e)=>{
            item.callback();
            e.stopPropagation();
          }
      }
      this.fields.set(item.name,{item:item,dom:btn})
      this.dom.appendChild(btn);
    });
    this.parent.appendChild(this.dom);
  }

  setPos(x,y){
    this.dom.style.top=y+'px';
    this.dom.style.left=x+'px';
  }
  

  updateField(name,condition=true,className=''){
    const field = this.fields.get(name)
    if(!field) return;
    switch (field.item.type) {
      case 'toggle':
          field.dom.className= condition ? field.item.on : field.item.off;
          field.dom.title= condition ? field.item.tooltipOn : field.item.tooltipOff;
        break;
      default:
        field.dom.className= className;
    }

  }

  dispose(){
    this.dom.remove();
  }

  hide(){
    if (this.visible) {
      this.dom.style.display='none'
      this.visible=false;
    }
  }

  show(){
    if (!this.visible) {
      this.dom.style.display='block'
      this.visible=true;
    }
  }
}

export default Toolbar