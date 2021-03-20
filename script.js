var data;
var baseElem = document.getElementById("main-table");
var apiKey;
var apiURL = "https://reacher-csv.herokuapp.com/v0/check_email"

function parse() {
    var file = document.getElementById('myDOMElementId').files[0];
    apiKey = document.getElementById('reacher-api-key').value;

    Papa.parse(file, {
      header: false,
      dynamicTyping: true,
      complete: function(results) {
        console.log("Finished:" + typeof(results.data));
        data = results.data;
        stepthroughResultsAndCallApi(data);
      }
    });
}

function stepthroughResultsAndCallApi(data) {
  if (!data.error) {
    for (let index of data) {
      var node = document.createElement("div");
      var textnode = document.createTextNode(index[0]);
      node.appendChild(textnode);
      node.id = index[0];
      document.getElementById("main-table").appendChild(node);

      postData(apiURL, { "to_email": index[0] })
        .then(data => {
          console.log(data);
          var content = document.getElementById(data.input).innerHTML;
          document.getElementById(data.input).innerHTML = content + " ### Result: " + data.is_reachable;
        });
    }
  }
  else {
    document.getElementById("main-table").innerHTML = data.error;
  }
}

async function postData(url, data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache',
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json',
      'x-saasify-proxy-secret': 'PATRICK1',
      'authorization': apiKey
      
    },
    redirect: 'follow', 
    referrerPolicy: 'origin-when-cross-origin',
    // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url 
    body: JSON.stringify(data) 
  });
  return response.json();
}

