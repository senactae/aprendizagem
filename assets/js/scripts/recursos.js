$(document).ready(function () {
  renderImgLegenda();
  flipCard();
});

function renderImgLegenda() {
  $(".img-legenda").each(function (index) {
    $wrapImg = $("<div>")
      .addClass("img-wrapper")
      .attr("id", "imgW_" + index);

    if ($(this).data("cor")) {
      $cor = $(this).data("cor");
      $wrapImg.addClass($cor);
    }
    $(this).wrap($wrapImg);

    if ($(this).data("legenda")) {
      $legendaImg = $("<span>").html($(this).data("legenda"));

      if ($(this).data("width"))
        $legendaImg.addClass("minText").css("width", $(this).data("width"));

      $(this).parent().append($legendaImg);
    }
  });
}

function flipCard() {
  $(".cardFlip").bind("click", function (evt) {
    $(this).toggleClass("giraCarta");
  });
}

/////////////////
// FLIPCARD
$(".card-selector .fcard").on("click", function () {
  $(this).toggleClass("active");
});

// SVG
if ($(".svgInterativo").length != 0) {
  $(".svgInterativo").svgLoader();
}

// TIMELINE VERTICAL
$(".verticalTimeline")
  .find("li")
  .on("click", function () {
    $(this).addClass("selected");
  });

// TIMELINE HORIZONTAL
if ($(".horizontalTimeline").length != 0) {
  $(".horizontalTimeline").timeline();
}
