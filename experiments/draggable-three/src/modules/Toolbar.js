class Toolbar {
  constructor(buttons,callbacks) {
    if (buttons.length>callbacks.length) console.warn('Not enough callbacks provided');
    this.dom = document.createElement('DIV');
    this.dom.classList.add('toolbox');
    this.parent=document.querySelector('#toolbox_wrapper')

    let btn;
    buttons.forEach((item, i) => {
      btn=document.createElement('DIV');
      btn.innerHTML=item.text;
      btn.title=item.tooltip;
      btn.onclick=(e)=>{
        if(callbacks[i])callbacks[i]();
        e.stopPropagation();
      }
      this.dom.appendChild(btn);
    });
    this.parent.appendChild(this.dom);
  }

  setPos(x,y){
    this.dom.style.top=y+'px';
    this.dom.style.left=x+'px';
  }

  dispose(){
    this.dom.remove();
  }
}

export default Toolbar