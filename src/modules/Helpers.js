function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return 'H'+Date.now()+result;
}

function connectionName(index) {
    var characters       = 'SFEGRTQXAHUBCVWZDYKIJOMPNL';
		let result = characters.substr(0,Math.floor(index/characters.length))+characters[index%characters.length]
    switch (result) {
      case 'SS':
        result='Sy'
        break;
      case 'SA':
        result='Sq'
        break;
      case 'KKK':
        result='kyk'
        break;
      default:
        result=result
    }
   return result
}

function map (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export {makeid,map,connectionName}