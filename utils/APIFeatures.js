// Class APIFeatures
class APIFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString
    }
    filter(){
             // 1A:Applying Filtering Method 1
            // Now Before Start Filtering We want to exclude some fields Which we dont want  to query in database
            let queryObj = { ...this.queryString }
            const excludeFiles = ['page','sort','limit','fields']
            excludeFiles.forEach(el=>{
                delete queryObj[el]
            })
            // 1B:Advance Filtering
            // Now if we want to use filter like greater than etc
            //  how object should look like  {difficulty = 'easy', duration:{$gte:5}}
            // But when we type in searching we get the result like this {difficulty = 'easy', duration:{gte:5}}
            // We just need to replace gte with $gte and so on    
            // console.log(req.query) Not desired Output
            // Solution of this error
            // Convert the javaScript object into string
            let queryStr = JSON.stringify(queryObj)
            queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g , match =>  `$${match}`)
            // console.log(JSON.parse(queryStr));//Now we are getting our desired result
    
    
            // console.log(req.query,queryObj)
           this.query = this.query.find(JSON.parse(queryStr));  //Working Fine
           return this;
    }
    
    sort(){ // 2 Sorting
    
        if(this.queryString.sort){
            let sortBy = this.queryString.sort.split(',').join(' ')
            // console.log(sortBy);
            // We want to sort like this // sort('price ratingsaverage')
            
            this.query = this.query.sort(sortBy) // Through this we can sort according to the prices
            // We can also specify another parameter in case tie
        }else{
            // If User Did not specify any thing Than by Default new Product come in top
            this.query = this.query.sort('-createdAt')//HardCoded
        }
    
        return this;
    
    }
    
    fieldLimits(){
      //Field Limiting(Selecting the specific Fields We want to see)
                    
      if(this.queryString.fields){
        const fields =  this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields)
    }else{
        this.query = this.query.select("-__v") //-(negative sign We USed to exclude(not wanted field))
    }
    
        return this
    }
    
    paginate(){
      // Pagination
    
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 20;
    
      const skip  = (page-1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    //   if(req.query.page){
    //       let totalTours = await Tour.countDocuments();
    //       if(skip>=totalTours){
    //           throw new  Error('This Page Does not exist')
    //       }
    //   }
    
      return this
    
    }
    }
    
module.exports = APIFeatures;    