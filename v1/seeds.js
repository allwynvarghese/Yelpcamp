const mongoose		=	require("mongoose");
const Campground	=	require("./models/Campground");
const Comments		=	require("./models/Comments");

//module export
module.exports = seedDB;

//create data based on the campground model
var data =[{
			name: "Heide-Park Holiday Camp",
			image: "https://media-cdn.tripadvisor.com/media/photo-w/0f/c9/e1/b2/heide-park-holiday-camp.jpg",
			desc: "#2 of 18 Specialty Lodging in Soltau"
		},
	   {
		   	name: "Tropical Islands",
			image: "https://media-cdn.tripadvisor.com/media/photo-w/0e/e0/84/4c/tropical-islands-lagune.jpg",
			desc: "Come in and discover the delights of Tropical Islands. Stroll along the sandy beach by the Tropical Sea, 				join an expedition through the Tropical Rainforest, relax in the Tropical Sauna & Spa Complex, experience 					exciting attractions for kids, have fun with the whole family, taste the wonderful food and enjoy some first-				class entertainment. You will also find that we have various accommodation options for you."
	   },
	   {
		   	name: "Camping am Moslepark",
			image: "https://media-cdn.tripadvisor.com/media/photo-w/06/65/d4/e9/vista-della-reception.jpg",
			desc: "Waldseestr. 77, 79117 Freiburg im Breisgau, Baden-Wurttemberg Germany"
	   }
	  ];

//create a func seedDB
function seedDB(){
	//Delete teh existing data
	Campground.remove({}, (err)=>{
		if(err){
			console.log(err);
		}else{
			//create data using the existing data list.
			data.forEach(function(seed){
				Campground.create(seed, (err, campground)=>{
					if(err){
						console.log(err);
					}else{
						Comments.create({
							text: "Nice loction, but I wished there was internet.",
							author: "John Doe"
						}, (err, comment)=>{
							if(err){
								console.log(err);
							}else{
								console.log("comment added!");
								campground.comments.push(comment);
								campground.save();
							}
						});
					}
				})
			})
		}
	})
}