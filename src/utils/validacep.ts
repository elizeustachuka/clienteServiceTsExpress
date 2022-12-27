const validacep = (cep : string) => {
    cep = cep.replace(/[^0-9]/gi, "");
    
    if (cep.length == 8) {
        return true;
    }
    
    else return false;
}

export default validacep