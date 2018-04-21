module.exports = function (mongoose) 
{
	const Schema = mongoose.Schema;
    const userSchema = new Schema(
    {
        login:		{ type: String, required:true },
        password:	{ type: String, required:true },
    });
    const buildingSchema = new Schema(
    {
        playerLogin: {type: String, required:true},
        buildingName : {type:String, required:true},
        bricks: 
        {
            type:
            [{
                length: {type:Number, required:true},
                rotation: 
                {
                    type:
                    {
                        x: {type:Number, required:true},
                        y: {type:Number, required:true},
                        z: {type:Number, required:true}
                    },
                    required:true
                },
                position:
                {
                    type:
                    {
                        x: {type:Number, required:true},
                        y: {type:Number, required:true},
                        z: {type:Number, required:true}
                    },
                    required:true
                },
                materialIndex: {type:Number, required:true}
            }],
            default:[]
        },
    });
    const models = 
    { 
        User: mongoose.model("User", userSchema),   
        Building: mongoose.model("Building", buildingSchema),  
    }
    return models;       
}