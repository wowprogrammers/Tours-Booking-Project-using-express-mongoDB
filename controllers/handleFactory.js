

exports.deleteOne = Model =>  async(req,res)=>{
    try {
        // console.log(req.params.id)
        const doc = await Model.findByIdAndDelete(req.params.id);
       
        if(!doc){
            return res.status(400).json({Message:"No Document Found With That ID"})

        }
        res.status(200).json({
            status:"Success"
        })
    } catch (error) {
        res.status(400).json({Error:error.message})
        
    }

}

exports.updateOne = Model =>  async(req,res)=>{
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })

        if(!doc){
            return res.status(400).json({Message:"No Document Found With That ID"})

        }
        res.status(200).json({
            status:"Success",
            data:doc
        })
    } catch (error) {
        res.status(400).json({Error:error.message})
        
    }

}

exports.getOne = (Model,popOptions) => async(req,res)=>{
    try {
        let query = Model.findById(req.params.id)
        if(popOptions) query = query.populate(popOptions)
        const doc = await query;
        if(!doc){
            return res.status(400).json({Message:"No Document Found With That ID"})
        }
        res.status(200).json({
            status:"Success",
            data:doc
        })
    } catch (error) {
        res.status(400).json({Error:error.message})
        
    }

}