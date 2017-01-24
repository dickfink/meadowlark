var fortunes = ["this is a thing", "that is a thing", "here is another thing",];

exports.getFortune = function(){
    
  var idx = Math.floor(Math.random() * fortunes.length);
  return fortunes[idx];

};