let isTouchDevice = navigator.userAgent.match(
  /(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/
);
let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
if (iOS) {
  $("body").addClass("ios");
}

// ADD ZERO
function addZero(n) {
  return n < 10 ? "0" + n : "" + n;
}

// Calcula Porcentagem
function calcPercByNumber(num, per) {
  return Math.round((num / per) * 100) + "%";
}
function calcPercByPerc(num, per) {
  return (num / 100) * per;
}

// INDEX
function Index() {
  let _this = this;

  //let killHT = setInterval(function(){ if (ht) { ht.destroy(); clearInterval(killHT); }}, 1000);

  _this.initContent();
}
Index.prototype.initContent = function () {
  let _this = this;

  // LOAD MENU
  _this.menu();
  _this.preloadContent();

  $(".opRadio").on("change", function () {
    $id = $(this).attr("id");
    $this = $id.substr($id.length - 1, 1);

    $val = $(this).val();
    $prop = $(this).prop("checked");

    $(".labelRadio").attr("aria-checked", "false");
    if ($prop) {
      $("#labelRadio" + $this).attr("aria-checked", "true");
    }

    $("input[name=optionsRadio]").attr("disabled", "disabled");
    console.log($(this).data("feed"), this);
    if ($(this).data("feed") != "") {
      $("#" + $(this).data("feed"))
        .hide()
        .removeClass("d-none")
        .slideToggle(600);
    }

    $("#feed" + $val)
      .hide()
      .removeClass("d-none")
      .slideToggle(600);
    $("html, body").animate(
      { scrollTop: $("#feed" + $val).offset().top - 100 },
      800
    );
  });
};

Index.prototype.menu = function () {
  let _this = this;

  let namePage,
    qualPage,
    pageModules = new Array(),
    pageNames = new Array(),
    totalPages = new Array();

  // CARREGA MENU
  $.getJSON("../assets/data/course.json", function (data) {
    carregaData(data);
  });

  function carregaData(data) {
    _this.telas = data.curso.conteudo.telas;
    _this.menu = [];
    _this.menuInterno = [];
    _this.paginas = [];
    _this.unidades = [];
    _this.verTitulo = "";

    _count = 0;
    $.each(_this.telas, function (i, val) {
      _this.paginas.push(val.url);

      _unidade = "";
      if (val.titulo && _this.verTitulo != val.titulo) {
        if (val.unidade && _this.verTitulo != val.unidade)
          _unidade = "Unidade: ";
        _this.unidades.push(val.titulo);
        $(".listaMenu").append(
          '<li><a class="btnMenuLi" id="btnMenu' +
            i +
            '" href="' +
            val.url +
            '">' +
            val.titulo +
            "</a></li>"
        );

        _this.menu.push(val);
        _this.menuInterno.push([val]);
        _count++;
      } else {
        _this.menuInterno[_count - 1].push(val);
      }
    });

    selectActiveItem();
  }

  function selectActiveItem() {
    let sURL = window.location.pathname,
      arrayURL = sURL.split("/"),
      namePage = arrayURL[arrayURL.length - 1];

    if (namePage == "") {
      namePage = "index.html";
    }
    qualPage = jQuery.inArray(namePage, _this.paginas);
    qualPage = $.map(_this.menuInterno, function (obj, index) {
      $.map(obj, function (objInterno, i) {
        if (namePage == objInterno.url) _this.linkAtivo = [index, i];
      });
    });

    _template =
      _this.menuInterno[_this.linkAtivo[0]][_this.linkAtivo[1]].template;

    $("body").addClass(_template);
    $(".img-template").each(function (i, v) {
      arrayFile = $(this).attr("src").split("/");
      imgFile = arrayFile[arrayFile.length - 1].split(".");
      arrayFile.pop();
      newSrc =
        arrayFile.join("/") +
        "/" +
        imgFile[0] +
        "_" +
        _template +
        "." +
        imgFile[1];
      $(this).attr("src", newSrc);
    });

    unidadeInfo = _this.unidades[_this.linkAtivo[0]];
    totalInterno = addZero(_this.menuInterno[_this.linkAtivo[0]].length);

    $(".pageInfo").html(
      "<span>" +
        unidadeInfo +
        "</span>Página " +
        addZero(Number(_this.linkAtivo[1]) + 1) +
        " de " +
        totalInterno
    );
    $(".listaMenu")
      .find("li")
      .eq(_this.linkAtivo[0])
      .children("a")
      .attr("href", "javascript:void(0);")
      .addClass("active");

    controlaNavegacao();
  }

  let abreFecha = 450,
    flagMenu = false;

  $(".botaoMenu").bind("click", function (e) {
    e.preventDefault();
    $(window).trigger("menuToggle");
  });
  $(window).bind("menuToggle", function () {
    $("nav").toggleClass("menuAtivo");
    $(".botaoMenu").toggleClass("ativo");
    setTimeout(function () {
      abreMenu();
    }, abreFecha);
  });

  function abreMenu() {
    if (!flagMenu) {
      $(".menuCurso").removeClass("menu-fechado").addClass("menu-aberto");
      flagMenu = true;
    } else {
      $(".menuCurso").removeClass("menu-aberto").addClass("menu-fechado");
      flagMenu = false;
    }
  }

  $(".menuBG").bind("click", function (e) {
    e.preventDefault();
    $(window).trigger("menuToggle");
  });

  // CONTROLA NAVEGAÇÃO
  function controlaNavegacao() {
    $(document).ajaxComplete(function (event, XMLHttpRequest, ajaxOptions) {
      let prevPage, nextPage;

      pageMenu = _this.menuInterno[_this.linkAtivo[0]];
      if (_this.linkAtivo[1] == 0) {
        $('.setaNavegacao[data-page="ant"]').hide(); //.attr('disabled', 'disabled');
        nextPage = pageMenu[Number(_this.linkAtivo[1]) + 1];
      } else if (_this.linkAtivo[1] == pageMenu.length - 1) {
        $('.setaNavegacao[data-page="prox"]').hide(); //.attr('disabled', 'disabled');
        prevPage = pageMenu[Number(_this.linkAtivo[1]) - 1];
      } else {
        prevPage = pageMenu[Number(_this.linkAtivo[1]) - 1];
        nextPage = pageMenu[Number(_this.linkAtivo[1]) + 1];
      }

      // CONTROLE POR BOTÕES
      $('.setaNavegacao[data-page="ant"]').bind("click", function () {
        navPages(prevPage.url);
      });
      $('.setaNavegacao[data-page="prox"]').bind("click", function () {
        navPages(nextPage.url);
      });

      // CONTROLE POR TECLADO
      $(document).bind("keyup", function (evt) {
        if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 37) {
          if (qualPage == 0) {
            $.noop();
          } else {
            navPages(prevPage);
          }
        } else if (evt.shiftKey && evt.ctrlKey && evt.keyCode == 39) {
          if (qualPage == totalPages.length) {
            $.noop();
          } else {
            navPages(nextPage);
          }
        }
      });
    });
  }
  function navPages(tipoPagina) {
    window.location = tipoPagina;
  }

  $(window).scroll(function () {
    if ($(document).scrollTop() > $("header").height()) {
      $("nav").addClass("fixedNav");
      $(".wrapper").addClass("pt100");
    } else {
      $("nav").removeClass("fixedNav");
      $(".wrapper").removeClass("pt100");
    }
  });

  $(".wrapper")
    .find("h1, h2, h3, h4, p, li, a")
    .not(".visuallyhidden")
    .attr("tabindex", "0")
    .attr("role", "text");
};

Index.prototype.preloadContent = function (type, data) {
  let $content = $("body");
  let $images = $content.find("img").add($content.filter("img"));
  let queue = new createjs.LoadQueue(true);

  $content.find("*").each(function (index, element) {
    var bg = $(this).css("background-image");

    if (
      bg !== "" &&
      bg.indexOf("linear-gradient") == -1 &&
      bg !== "none" &&
      bg.indexOf("svg+xml") == -1
    ) {
      bg = bg.replace("url(", "").replace(")", "").split('"').join("");

      var img = new Image();
      img.src = bg;

      $image = { id: "bgImg_" + index, src: bg };
      queue.loadFile($image);
    }
  });
  $images.each(function (index, el) {
    $image = { id: "img_" + index, src: this.src };
    queue.loadFile($image);
  });

  queue.on(
    "complete",
    function (event) {
      $("body").removeClass("initOverflow");
      $(".loadingContent").fadeOut(600, function () {
        $("body").addClass("animaConteudo").trigger("classChange");
      });
    },
    this
  );

  if ($images.length == 0) {
    $("body").removeClass("initOverflow");
    $(".loadingContent").fadeOut(600, function () {
      $("body").addClass("animaConteudo").trigger("classChange");
    });
  }
};

Index.prototype.Exercicio = function () {
  let _this = this;

  let valoresAntigos = [],
    valoresNovos = [
      "Selecione uma opção",
      "Selecione uma opção",
      "Selecione uma opção",
      "Selecione uma opção",
      "Selecione uma opção",
      "Selecione uma opção",
    ];

  function AdicionaRemoveDisable(el) {
    if (el.classList.contains("Desabilitado")) {
      el.classList.remove("Desabilitado");
      el.disabled = false;
    } else {
      el.classList.add("Desabilitado");
      el.disabled = true;
    }

    if (el.innerText == "Selecione uma opção") {
      el.classList.remove("Desabilitado");
      el.disabled = false;
    }
  }

  function atvFAse1() {
    let wordsArr = [
      "Etapa 1",
      "Etapa 2",
      "Etapa 3",
      "Etapa 4",
      "Etapa 5",
      "Etapa 6",
    ];
    selectVal = [];

    $(".atividade")
      .find(".selectItens")
      .each(function (i, v) {
        $select = $("<select>");
        $select.addClass("selectWords").attr("id", "select_" + addZero(i));
        $option = $(
          '<option value="" selected="selected">Selecione uma opção</option>'
        );
        $select.append($option);
        selectVal.push("");

        $.each(wordsArr, function (j, val) {
          $opt = $("<option>");
          $opt.val(j).text(val);
          $select.append($opt);
        });
        $select.on("change", contSelect);

        $(this).replaceWith($select);
      });
    $(".atividade").find(".selectWords").customA11ySelect();

    function contSelect() {
      cont = 0;

      let options = document.querySelectorAll(
          ".custom-a11yselect-option button"
        ), //lista todas as opcoes
        combosSelecionados = document.querySelectorAll(
          ".custom-a11yselect-container .custom-a11yselect-btn"
        ), //lista os combos selecionados
        idSelecionado = this.id.slice(this.id.length - 1), //id da combo box selecionada
        ValorSelecionado = this.value == "" ? 0 : parseInt(this.value) + 1, // valor que o usuário acabou de escolher
        TextoDoValorSelecionado = this[ValorSelecionado].innerText; // texto que o usuário acabou de escolher

      // preenche 2 arrays, o arrayAntigo fica com os dados da ultima vez que o usuário clicou o arrayNovo, fica com o dado que o usuário acabou de digitar
      for (let i = 0; i < valoresNovos.length; i++) {
        valoresAntigos[i] = valoresNovos[i];
        if (idSelecionado == i) {
          valoresNovos[i] = TextoDoValorSelecionado;

          //adiciona ou remove a classe desabilitado da parte selecionada do combo e não permite que a opcao Selecione uma opçao receba esta classe
          if (
            combosSelecionados[idSelecionado].innerText != "Selecione uma opção"
          ) {
            combosSelecionados[idSelecionado].classList.add("Desabilitado");
          } else {
            combosSelecionados[idSelecionado].classList.remove("Desabilitado");
          }
        }
      }

      //libera os itens
      for (let b = 0; b < valoresNovos.length; b++) {
        if (valoresAntigos[b] != valoresNovos[b]) {
          let dListI = options; // returns NodeList
          let dArrayI = Array.prototype.slice.call(dListI); // преобразует NodeList в Array
          $.each(dArrayI, function (i, v) {
            textoSel = $(v).text();
            if (textoSel == valoresAntigos[b]) {
              AdicionaRemoveDisable(v);
            }
          });

          break;
        }
      }

      //bloqueia os itens
      var dList = options; // returns NodeList
      var dArray = Array.prototype.slice.call(dList); // преобразует NodeList в Array
      $.each(dArray, function (i, v) {
        textoSel = $(v).text();
        if (textoSel == TextoDoValorSelecionado) {
          AdicionaRemoveDisable(v);
        }
      });

      $(".atividade")
        .find(".selectWords")
        .each(function (i, v) {
          if (v.value != "") {
            cont++;
            selectVal[i] = v.value;
            $("#" + $(this).attr("id") + "_sel").addClass("selected");
          } else {
            $("#" + $(this).attr("id") + "_sel").removeClass("selected");
          }
        });

      if (cont == $(".atividade").find(".selectWords").length) {
        $(".atividade").find(".botaoConfirmar").removeAttr("disabled");
        //console.log('entrou')
      }
    }

    $(".atividade")
      .find(".botaoConfirmar")
      .on("click", function () {
        optionsVal = [];
        optionsRow = [];

        $(".atividade")
          .find(".selectWords")
          .each(function (i, v) {
            optionsVal.push(Number($(this).find("option:selected").val()));

            $div = $("<div>");
            $h4 = $("<h4>").html($(this).find("option:selected").text());
            $ul = $(this)
              .parents(".atividadeRow")
              .find(".quadroAtividade")
              .html();
            $div.html($h4).append($ul);
            optionsRow.push($div);
          });

        $.each(optionsRow, function (i, v) {
          qualCasa = $.inArray(i, optionsVal);
          $(".contentFeed").append(optionsRow[qualCasa]);
        });

        $(this).attr("disabled", "disabled").addClass("d-none");
        $(".atividade")
          .find("button")
          .attr("disabled", "disabled")
          .addClass("disabled");
        $("#faixaFeed").removeClass("d-none").fadeIn(200);
        $("html, body").animate(
          { scrollTop: $("#faixaFeed").offset().top - 115 },
          800
        );
      });
  }

  atvFAse1();
};

// SVG LOADER
function svgLoader() {
  let _this = this;

  _this.w = "";
  _this.lastView = "";
  _this.object = [];
  _this.defineHW();
}

svgLoader.prototype.loadContent = function (obj, func) {
  let _this = this;

  obj.each(function (i, v) {
    let imgID = $(this).attr("id"),
      imgClass = $(this).attr("class"),
      dataD = $(this).data("desktop"),
      dataP = $(this).data("phone"),
      dataT = $(this).data("tablet"),
      dataF = $(this).data("feed"),
      $divObj = $("#d_" + imgID),
      imgURL = "";

    $divObj.empty();

    if ($(this).hasClass("desktopR")) {
      imgURL = dataD;
    } else if ($(this).hasClass("tabletR")) {
      imgURL = dataT;
    } else if ($(this).hasClass("phoneR")) {
      imgURL = dataP;
    } else {
      imgURL = dataD;
    }

    $.get(
      imgURL,
      function (data) {
        let $svg = $(data).find("svg");

        if (typeof imgID !== "undefined") {
          $svg = $svg.attr("id", imgID);
        }

        if (typeof imgClass !== "undefined") {
          $svg = $svg.attr("class", imgClass + " replaced-svg");
        }

        $svg = $svg.removeAttr("xmlns:a");
        $svg_viewBox = $svg.attr("viewBox").split(" ");

        $svg.data("aspect", 100 * ($svg_viewBox[3] / $svg_viewBox[2]));
        $svg.removeClass("d-none").css("width", "100%");
        $svg.attr("aria-hidden", "true").attr("tabindex", "-1");

        $divObj.html($svg).data("feed", dataF);

        if (func !== undefined) {
          _this.bindSVG($divObj, func);
        } else {
          _this.bindSVG($divObj);
        }
      },
      "xml"
    );
  });

  $(window).resize(function () {
    resizeSVG();
  });

  function resizeSVG() {
    clearTimeout(window.resizeEvt);

    _this.w = $(window).width();
    _this.defineHW();

    window.resizeEvt = setTimeout(function () {
      _this.loadContent(obj, func);

      clearTimeout(window.resizeEvt);
    }, 250);
  }
};

svgLoader.prototype.defineHW = function () {
  let _this = this;

  _this.w = $(window).width();

  let allClasses = "phoneR tabletR desktopR",
    obj = $(".interactive");

  if (_this.w <= 767) {
    obj.removeClass(allClasses).addClass("phoneR");
    _this.lastView = "phone";
  } else if (_this.w > 767 && _this.w <= 993) {
    obj.removeClass(allClasses).addClass("tabletR");
    _this.lastView = "tablet";
  } else {
    obj.removeClass(allClasses).addClass("desktopR");
    _this.lastView = "desktop";
  }
};

svgLoader.prototype.bindSVG = function (obj, func) {
  let _this = this;

  let aspectRatio_svg = obj.find(".interactive").data("aspect");
  obj.css({ width: "100%", "padding-bottom": aspectRatio_svg + "%" });
  if (func !== undefined) {
    func();
  }
};
