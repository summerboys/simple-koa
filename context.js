let proto = {};

function definedProps(key, name){
    Object.defineProperty(proto, name, {
        get: function() {
            return this[key][name]
        },
         set: function(newVal){
            this[key][name] = newVal
         }
    })
}

// 定义 request 中的 get set 
let requestSet = [],
    requestGet = ['query'];

// response getter setter 

let responseSet = ['body', 'status'],
    responseGet = requestSet;

requestSet.forEach(item => {
    definedProps('request', item)
})

requestGet.forEach(item => {
    definedProps('request', item)
})

responseSet.forEach(item => {
    definedProps('response', item)
})

responseGet.forEach(item => {
    definedProps('response', item)
})

module.exports = proto