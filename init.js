var i = 0;
var arr;
function create(n) {
  i = 0;
  arr = Array(n).fill(++i);
}
var initCors = [
  {
    "name": "Eco Algebra Years 1-5",
    "img" : "../images/bird.svg",
    "cat": 1,
    "label": "Free",
    "price" : 0.00,
    "descr" : "An engaging course for juniors. It teaches them to unleash" +
      "the power of algebra to save the planet.",
    content : [
      {
        imgs : {
          first :[1,1,1,1,1]
        },
        srcs : {
          first : "../images/tree5.svg"
        },
        problem : "A rain forest covers over 2500 Hectares. 500 Hectares have " +
        "already been cleared at the rate of 250 Hectares per year. How long " +
        "will it take for the forest to disappear completely?",
        prompt : "Transform the problem into an algebraic expression.",
        submit : "Now solve the expression and submit it.",
        answ : "4"
      },
      {
        imgs : {
          first :[1,1,1,1,1]
        },
        srcs : {
          first : "../images/tree5.svg"
        },
        problem : "2nd: A rain forest covers over 2500 Hectares. 500 Hectares have " +
        "already been cleared at the rate of 250 Hectares per year. How long " +
        "will it take for the forest to disappear completely?",
        prompt : "Transform the problem into an algebraic expression.",
        submit : "Now solve the expression and submit it.",
        answ : "4"
      }
    ]
  },
  {
    "name": "Eco Algebra Years 6-10",
    "img" : "../images/bird.svg",
    "cat": 2,
    "label": "Free",
    "price" : 0.00,
    "descr" : "An engaging course for intermediates. It teaches them to unleash" +
      "the power of algebra to save the planet.",
    content : [],
    ans: []
  },
  {
    "name": "Eco Algebra Years 11-15",
    "img" : "../images/bird.svg",
    "cat": 3,
    "label": "Free",
    "price" : 0.00,
    "descr" : "An engaging course for seniors. It teaches them to unleash" +
      "the power of algebra to save the planet.",
    content : [],
    ans: []
  },
];
function initCor() {
  db = db.getSiblingDB('cap');
  db.courses.drop();
  var bulk = db.courses.initializeUnorderedBulkOp();
  bulk.insert( initCors[0] );
  bulk.insert( initCors[1] );
  bulk.insert( initCors[2] );
  bulk.execute();
}
