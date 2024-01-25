import  {userModel}  from "./models/user.model.js";

class Validates{
    
    constructor(){
        this.name = String;
        this.surname = String;
        this.mail = String;
        this.age = Number;
        this.password = String;
    }
    valueExist(value){
       if(value !== null && value !== undefined && value !== ''){
        return true
       }else{
        return false
       }
    }

    valueFloats(){
        if(this._checkValue(value) && parseFloat(value) > 0){
            return true
           }else{
            return false
           }
    }

    
}


export default Validates;
