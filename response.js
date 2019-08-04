module.exports = {
    // 设置给客户端返回内容
    get body(){
        return this._body
    },
    set body(data){
        this._body = data
    },

    // 设置给客户端返回 statusCode
    set status(code){
        if(typeof code !== 'number'){
            throw new Error('code is not a number')
        }
        this.res.status = code
    }
}