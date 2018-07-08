
 /*
    插入
    data 单条数据为对象
        多条数据为数组
 */
 function insert(model,data){

    return new Promise((resolve,rej)=>{

        model.create(data,(err,res)=>{
            if(err){
                console.log('insertErr'+err)
                rej(err)
            }else{
                console.log('insertRes'+res)
                resolve(res)
            }
        })
    })
}

 //删除
 function del(model,id){

    return new Promise((resolve,rej)=>{

        model.findByIdAndRemove(id, function(err, res){
            if (err) {
                console.log("delError:" + err);
                rej(err)
            }
            else {
                console.log("delRes:" + res);
                resolve(res)
            }
        })
    })
}

//更新
function update(model,id,update){

    return new Promise((resolve,rej)=>{

        model.findByIdAndUpdate(id, update,{
            new:true
        }, function(err, res){
            if (err) {
                console.log("updateError:" + err);
                rej(err)
            }
            else {
                console.log("updateRes:" + res);
                resolve(res)
            }
        })
    })
}

module.exports = {
    insert,update,del
}