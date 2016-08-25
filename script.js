var documents = [];

function Document(pageid, title, extract) {
  this.title = title;
  this.pageid = pageid;
  this.extract = extract;
}

function setExternalLink(div, document) {
  $.ajax({
    url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=info&inprop=url&pageids=' + document.pageid,
    type: 'get',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Accept": "application/json"
    },
    dataType: 'jsonp',
    success: function(data) {
      var externalLink = data.query.pages[document.pageid].fullurl;
      div.on("click", function() {
        window.open(externalLink, "_blank");
      });
    }
  });
}

function createElements(documents) {
  for (var i = 0; i < documents.length; i++) {
    var div = $("<div>", {
      id: "result",
      class: "row"
    });
    var h3 = $("<h3>", {
      class: "text-left text-info"
    });
    var p = $("<p>", {
      class: "text-left"
    });
    var hr = $("<hr>");
    h3.text(documents[i].title);
    p.text(documents[i].extract);
    div.append(h3);
    div.append(p);
    div.append(hr);
    setExternalLink(div, documents[i]);

    $("#app").append(div);
  }
}

function search(value) {
  $.ajax({
    url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=extracts&exintro&explaintext&exsentences=2&exlimit=max&gsrsearch=' + value,
    type: 'get',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Accept": "application/json"
    },
    dataType: 'jsonp',
    success: function(data) {
      var pages = data.query.pages;
      Object.keys(pages).forEach(function(page) {
        var doc = new Document(pages[page].pageid, pages[page].title, pages[page].extract);
        documents.push(doc);
      });
      createElements(documents);
    }
  });
}

$(document).ready(function() {
  $("#searchButton").on("click", function() {
    var token = $("#searchBox").val();
    if (token !== "") {
      $("#app").empty();
      documents = [];
      search(token);
      $("#searchBox").val("");
    }
  });

  $("#randomButton").on("click", function() {
    window.open("https://en.wikipedia.org/wiki/Special:Random", "_blank");
  });

  $("#searchbox").keypress(function(e) {
    if (e.which == 13) {
      var token = $("#searchBox").val();
      if (token !== "") {
        $("#app").empty();
        documents = [];
        search(token);
        $("#searchBox").val("");
      }
    }
  });

});
