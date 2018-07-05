
 //插入
 function insert(model){
    let data = model

    model.save((err,res)=>{
        if(err){
            console.log('insertErr'+err)
            return err
        }else{
            console.log('insertRes'+res)
            return res
        }
    })
}

//更新
function update(model,id,update){
    var wherestr = id;
    var updatestr = update;
    console.log(wherestr)
    model.findByIdAndUpdate(wherestr, updatestr, function(err, res){
        if (err) {
            console.log("updateError:" + err);
            return err
        }
        else {
            console.log("updateRes:" + res);
            return res
        }
    })
}

module.exports = {
    insert,update
}