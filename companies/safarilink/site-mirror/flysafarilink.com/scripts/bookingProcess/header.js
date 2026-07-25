var monthCalendar = cloneElement("dateFrame_month", 0);
var searchCalendar = [];
var searchCalendarFetching = false;
var searchCalendarReturn = [];
var searchCalendarReturnFetching = false;
var selectedOutKey = 0;
var selectedInKey = 0;
var minimumKey = 0;
var selectedKey = selectedOutKey;
var lastDateRequested = false;
var queryArray = createQueryArray(window.location.pathname, "flightresults");
var direction = "out";
var globalDestinations = [];
var globalSightseeingDestination = [];
var globalSightseeing = false;
var tripType;
var farebackup = 0;
var maxMonthsNoFares = 0;
var calendarPricesOnReturn = $("#showpriceonreturncalendaronly").val();
if ($(".flightType").attr("toggle") == "1") {
  tripType =
    queryArray["end"] === "NA" || $("#type_RT").css("display") === "none"
      ? "OW"
      : "RT";
} else {
  tripType =
    queryArray["end"] === "NA" ||
      $(".flightType .comboHolder").find(":selected").val() === "OW"
      ? "OW"
      : "RT";
}
if ($("#searchDone").val() == "false") {
  tripType = $("#defaultSearch").val();
}
if (window.location.search != "") {
  const params = new URLSearchParams(window.location.search);
  if (params.get("coupErr")) showCoupError(params.get("coupErr"));
}
var returnDestinations = [];
var firstLoad = true;
var resultsFromSearch = false;
//Fix for changing destinations before search is over
var xmlHttps = [];
//Var toDST is relevant because if we change the fromDst - we remove the todst
var toDST = "";
//Fix for flag pop
var click = false;
/* --------------------------------------------------------------------------------------------------------------------------------------  */

callController(
  "bookingProcess",
  "validateSession",
  false,
  false,
  false,
  function (validation) {
    var validation = JSON.parse(validation);
    if (!validation.success)
      if (validation.redirect !== undefined && validation.redirect) {
        //No valid items popup
        $("#overlay").attr("aria-hidden", "false");
        $("#sessionNotValid")
          .fadeIn()
          .promise()
          .done(function () {
            $("#overlay").attr("aria-hidden", "false");
            $("#overlay").css("display", "");
          });
      }
  }
);

//close modal for non valid session
$("#closesessionNotValid, a[aria-controls='sessionNotValid']").click(
  function () {
    $("#sessionNotValid")
      .fadeOut()
      .promise()
      .done(function () {
        $(this).attr("aria-hidden", "true");
        $(this).css("display", "");
      });
    window.location.href = $("#homeUrl").val();
  }
);

if ($(".engineTabs").length > 0) {
  $(window).resize(function () {
    var numberOfTabs = $(".engineTabs ul li").length;
    if (
      numberOfTabs > 4 &&
      getViewport_width() > 1280 &&
      $(".flightType").attr("horizontal") == "1"
    ) {
      $(".engineTabs li a").css("width", "248px");
    } else {
      $(".engineTabs li a").css("width", "");
    }
  });
  $(window).resize();
  $(".engineTabs li a").on("click", function () {
    if ($(this).attr("aria-selected") == "false") {
      selfix = this;
      if ($(selfix).attr("id") === "engineTab_flightAndHotel") {
        window.open($(selfix).attr("href"), "_blank");
        $(selfix).attr("aria-selected", "false");
        return false;
      }
      $(".engineTabs li a").attr("aria-selected", "false");
      $(selfix).attr("aria-selected", "true");

      setTimeout(function () {
        $('.enginePanel[aria-hidden="false"]')
          .fadeOut(250)
          .promise()
          .done(function () {
            $(this).attr("aria-hidden", "true");
            $(this).css("display", "");

            $("#" + $(selfix).attr("aria-controls"))
              .fadeIn(250)
              .promise()
              .done(function () {
                $(this).attr("aria-hidden", "false");
                $(this).css("display", "");
              });
          });
      }, 250);
    }
    return false;
  });
}

if ($(".flightForm").exists()) {
  //Fix for bug on chrome where the inputs remembering false values
  $("#flightFrom").val("");
  $("#flightTo").val("");
  $("#flightDepart").val("");
  $("#flightReturn").val("");
  if (
    $("#flightForm_passengers").attr("data-default") != undefined &&
    $("#flightForm_passengers").attr("data-default") != ""
  ) {
    $("#flightForm_passengers").val(
      $("#flightForm_passengers").attr("data-default")
    );
  }

  callController(
    "general",
    "destinations",
    "",
    false,
    false,
    function (destinations) {
      returnDestinations = [];
      destinations = JSON.parse(destinations);
      globalDestinations = destinations;
      var selectedDestinations = false;
      if (typeof destinations[destinations.length - 1] === "object") {
        if (
          destinations[destinations.length - 1].from != undefined ||
          destinations[destinations.length - 1].to != undefined
        ) {
          sightseeingObj = {};
          selectedDestinations = destinations[destinations.length - 1];
          if (destinations[destinations.length - 1].sightseeing) {
            $(".flightType select option[value='OW']").prop("selected", true);
            $(".flightType .comboHolder select option[value='OW']").prop(
              "selected",
              true
            );
            $('input[id="type_OW"]').prop("checked", true);
            $("#flightReturn").addClass("disabled");
            $(".flightType .comboHolder select").prop("disabled", "disabled");
            $(".flightType select").prop("disabled", "disabled");
            $('input[id="type_RT"]').addClass("disabled");
            $('input[id="type_RT"]').prop("disabled", "disabled");
            globalSightseeing = true;
            sightseeingObj = {
              name: " " + destinations[destinations.length - 1].sightseeingName,
              code: destinations[destinations.length - 1].sightseeingCode,
              icon: false,
            };
          }
          destinations.splice(destinations.length - 1);
          if (Object.keys(sightseeingObj).length > 0)
            globalDestinations.push(sightseeingObj);
        }
      }
      $("#flightFrom, #flightTo").each(function () {
        var $self = $(this);
        $self.on("focus", function () {
          $(this).parents("label").addClass("focused");
          // closePassengers();
          closeDates();
          var e = jQuery.Event("keyup");
          e.which = 0; //choose the one you want
          e.keyCode = 0;
          var value = $(this).val() !== "" ? $(this).val() : " ";
          $(this).val(value).trigger(e);
          $(this).parents("label").addClass("focused");
        });
        if (!isUserFromMobile()) {
          $self.easyAutocomplete({
            data: destinations,
            getValue: function (element) {
              return element.name + " %% " + element.code;
            },
            list: {
              maxNumberOfElements: 100,
              onShowListEvent: function () {
                $self.parents("label").addClass("focused");
                isThereKiwi = false;
                destinations.forEach(function (dst) {
                  if (dst.icon) {
                    isThereKiwi = true;
                  }
                });
                if (
                  $self
                    .siblings(".easy-autocomplete-container")
                    .find(".globeRemark").length <= 0 &&
                  isThereKiwi
                )
                  $self
                    .siblings(".easy-autocomplete-container")
                    .find("ul")
                    .append(
                      "<div class='globeRemark'><svg aria-hidden='false' fill='#ffffff' focusable='false' data-prefix='fas' data-icon='globe-africa' class='svg-inline--fa fa-globe-africa fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 650 750'><path fill='currentColor' d='M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm160 215.5v6.93c0 5.87-3.32 11.24-8.57 13.86l-15.39 7.7a15.485 15.485 0 0 1-15.53-.97l-18.21-12.14a15.52 15.52 0 0 0-13.5-1.81l-2.65.88c-9.7 3.23-13.66 14.79-7.99 23.3l13.24 19.86c2.87 4.31 7.71 6.9 12.89 6.9h8.21c8.56 0 15.5 6.94 15.5 15.5v11.34c0 3.35-1.09 6.62-3.1 9.3l-18.74 24.98c-1.42 1.9-2.39 4.1-2.83 6.43l-4.3 22.83c-.62 3.29-2.29 6.29-4.76 8.56a159.608 159.608 0 0 0-25 29.16l-13.03 19.55a27.756 27.756 0 0 1-23.09 12.36c-10.51 0-20.12-5.94-24.82-15.34a78.902 78.902 0 0 1-8.33-35.29V367.5c0-8.56-6.94-15.5-15.5-15.5h-25.88c-14.49 0-28.38-5.76-38.63-16a54.659 54.659 0 0 1-16-38.63v-14.06c0-17.19 8.1-33.38 21.85-43.7l27.58-20.69a54.663 54.663 0 0 1 32.78-10.93h.89c8.48 0 16.85 1.97 24.43 5.77l14.72 7.36c3.68 1.84 7.93 2.14 11.83.84l47.31-15.77c6.33-2.11 10.6-8.03 10.6-14.7 0-8.56-6.94-15.5-15.5-15.5h-10.09c-4.11 0-8.05-1.63-10.96-4.54l-6.92-6.92a15.493 15.493 0 0 0-10.96-4.54H199.5c-8.56 0-15.5-6.94-15.5-15.5v-4.4c0-7.11 4.84-13.31 11.74-15.04l14.45-3.61c3.74-.94 7-3.23 9.14-6.44l8.08-12.11c2.87-4.31 7.71-6.9 12.89-6.9h24.21c8.56 0 15.5-6.94 15.5-15.5v-21.7C359.23 71.63 422.86 131.02 441.93 208H423.5c-8.56 0-15.5 6.94-15.5 15.5z'></path></svg><span>" +
                      $("#otherAirline").val() +
                      "</span></div>"
                    );
              },
              onHideListEvent: function () {
                //                      $self.parents('label').removeClass('focused');
                if ($self.val() != "")
                  $self.parents("label").addClass("filled");
              },
              onChooseEvent: function () {
                $self.val($self.getSelectedItemData().name);
                updateSelectedDSTcss($($self).attr("id"), true);
                $($self).trigger("click");
              },
              onSelectItemEvent: function () {
                $self.val($self.getSelectedItemData().name);
                updateSelectedDSTcss($($self).attr("id"));
              },
              match: { enabled: true },
              onMouseOverEvent: function () {
                updateSelectedDSTcss($($self).attr("id"));
              },
            },
            template: {
              type: "custom",
              method: function (value, item) {
                var icon = "";
                if (item.icon) {
                  icon =
                    "<svg aria-hidden='false' fill='#ffffff' focusable='false' data-prefix='fas' data-icon='globe-africa' class='svg-inline--fa fa-globe-africa fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 650 600'><path fill='currentColor' d='M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm160 215.5v6.93c0 5.87-3.32 11.24-8.57 13.86l-15.39 7.7a15.485 15.485 0 0 1-15.53-.97l-18.21-12.14a15.52 15.52 0 0 0-13.5-1.81l-2.65.88c-9.7 3.23-13.66 14.79-7.99 23.3l13.24 19.86c2.87 4.31 7.71 6.9 12.89 6.9h8.21c8.56 0 15.5 6.94 15.5 15.5v11.34c0 3.35-1.09 6.62-3.1 9.3l-18.74 24.98c-1.42 1.9-2.39 4.1-2.83 6.43l-4.3 22.83c-.62 3.29-2.29 6.29-4.76 8.56a159.608 159.608 0 0 0-25 29.16l-13.03 19.55a27.756 27.756 0 0 1-23.09 12.36c-10.51 0-20.12-5.94-24.82-15.34a78.902 78.902 0 0 1-8.33-35.29V367.5c0-8.56-6.94-15.5-15.5-15.5h-25.88c-14.49 0-28.38-5.76-38.63-16a54.659 54.659 0 0 1-16-38.63v-14.06c0-17.19 8.1-33.38 21.85-43.7l27.58-20.69a54.663 54.663 0 0 1 32.78-10.93h.89c8.48 0 16.85 1.97 24.43 5.77l14.72 7.36c3.68 1.84 7.93 2.14 11.83.84l47.31-15.77c6.33-2.11 10.6-8.03 10.6-14.7 0-8.56-6.94-15.5-15.5-15.5h-10.09c-4.11 0-8.05-1.63-10.96-4.54l-6.92-6.92a15.493 15.493 0 0 0-10.96-4.54H199.5c-8.56 0-15.5-6.94-15.5-15.5v-4.4c0-7.11 4.84-13.31 11.74-15.04l14.45-3.61c3.74-.94 7-3.23 9.14-6.44l8.08-12.11c2.87-4.31 7.71-6.9 12.89-6.9h24.21c8.56 0 15.5-6.94 15.5-15.5v-21.7C359.23 71.63 422.86 131.02 441.93 208H423.5c-8.56 0-15.5 6.94-15.5 15.5z'></path></svg>";
                }
                string = value.substring(0, value.indexOf("%%"));

                var re = new RegExp("<b> </b>", "g");
                var re1 = new RegExp("[ ]", "g");
                string = string.replace(re, " ");

                return string + icon;
              },
            },
          });
        } else {
          $self.easyAutocomplete({
            data: destinations,
            getValue: function (element) {
              return element.name + " %% " + element.code;
            },
            list: {
              maxNumberOfElements: 100,
              onShowListEvent: function () {
                $self.parents("label").addClass("focused");
                isThereKiwi = false;
                destinations.forEach(function (dst) {
                  if (dst.icon) {
                    isThereKiwi = true;
                  }
                });
                if (
                  $self
                    .siblings(".easy-autocomplete-container")
                    .find(".globeRemark").length <= 0 &&
                  isThereKiwi
                )
                  $self
                    .siblings(".easy-autocomplete-container")
                    .find("ul")
                    .append(
                      "<div class='globeRemark'><svg aria-hidden='false' fill='#ffffff' focusable='false' data-prefix='fas' data-icon='globe-africa' class='svg-inline--fa fa-globe-africa fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 650 750'><path fill='currentColor' d='M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm160 215.5v6.93c0 5.87-3.32 11.24-8.57 13.86l-15.39 7.7a15.485 15.485 0 0 1-15.53-.97l-18.21-12.14a15.52 15.52 0 0 0-13.5-1.81l-2.65.88c-9.7 3.23-13.66 14.79-7.99 23.3l13.24 19.86c2.87 4.31 7.71 6.9 12.89 6.9h8.21c8.56 0 15.5 6.94 15.5 15.5v11.34c0 3.35-1.09 6.62-3.1 9.3l-18.74 24.98c-1.42 1.9-2.39 4.1-2.83 6.43l-4.3 22.83c-.62 3.29-2.29 6.29-4.76 8.56a159.608 159.608 0 0 0-25 29.16l-13.03 19.55a27.756 27.756 0 0 1-23.09 12.36c-10.51 0-20.12-5.94-24.82-15.34a78.902 78.902 0 0 1-8.33-35.29V367.5c0-8.56-6.94-15.5-15.5-15.5h-25.88c-14.49 0-28.38-5.76-38.63-16a54.659 54.659 0 0 1-16-38.63v-14.06c0-17.19 8.1-33.38 21.85-43.7l27.58-20.69a54.663 54.663 0 0 1 32.78-10.93h.89c8.48 0 16.85 1.97 24.43 5.77l14.72 7.36c3.68 1.84 7.93 2.14 11.83.84l47.31-15.77c6.33-2.11 10.6-8.03 10.6-14.7 0-8.56-6.94-15.5-15.5-15.5h-10.09c-4.11 0-8.05-1.63-10.96-4.54l-6.92-6.92a15.493 15.493 0 0 0-10.96-4.54H199.5c-8.56 0-15.5-6.94-15.5-15.5v-4.4c0-7.11 4.84-13.31 11.74-15.04l14.45-3.61c3.74-.94 7-3.23 9.14-6.44l8.08-12.11c2.87-4.31 7.71-6.9 12.89-6.9h24.21c8.56 0 15.5-6.94 15.5-15.5v-21.7C359.23 71.63 422.86 131.02 441.93 208H423.5c-8.56 0-15.5 6.94-15.5 15.5z'></path></svg><span>" +
                      $("#otherAirline").val() +
                      "</span></div>"
                    );
              },
              onHideListEvent: function () {
                //                      $self.parents('label').removeClass('focused');
                if ($self.val() != "")
                  $self.parents("label").addClass("filled");
              },
              onChooseEvent: function () {
                $self.val($self.getSelectedItemData().name);
                updateSelectedDSTcss($($self).attr("id"), true);
                $($self).trigger("click");
              },
              onSelectItemEvent: function () {
                $self.val($self.getSelectedItemData().name);
              },
              match: { enabled: true },
            },
            template: {
              type: "custom",
              method: function (value, item) {
                var icon = "";
                if (item.icon) {
                  icon =
                    "<svg aria-hidden='false' fill='#ffffff' focusable='false' data-prefix='fas' data-icon='globe-africa' class='svg-inline--fa fa-globe-africa fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 650 600'><path fill='currentColor' d='M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm160 215.5v6.93c0 5.87-3.32 11.24-8.57 13.86l-15.39 7.7a15.485 15.485 0 0 1-15.53-.97l-18.21-12.14a15.52 15.52 0 0 0-13.5-1.81l-2.65.88c-9.7 3.23-13.66 14.79-7.99 23.3l13.24 19.86c2.87 4.31 7.71 6.9 12.89 6.9h8.21c8.56 0 15.5 6.94 15.5 15.5v11.34c0 3.35-1.09 6.62-3.1 9.3l-18.74 24.98c-1.42 1.9-2.39 4.1-2.83 6.43l-4.3 22.83c-.62 3.29-2.29 6.29-4.76 8.56a159.608 159.608 0 0 0-25 29.16l-13.03 19.55a27.756 27.756 0 0 1-23.09 12.36c-10.51 0-20.12-5.94-24.82-15.34a78.902 78.902 0 0 1-8.33-35.29V367.5c0-8.56-6.94-15.5-15.5-15.5h-25.88c-14.49 0-28.38-5.76-38.63-16a54.659 54.659 0 0 1-16-38.63v-14.06c0-17.19 8.1-33.38 21.85-43.7l27.58-20.69a54.663 54.663 0 0 1 32.78-10.93h.89c8.48 0 16.85 1.97 24.43 5.77l14.72 7.36c3.68 1.84 7.93 2.14 11.83.84l47.31-15.77c6.33-2.11 10.6-8.03 10.6-14.7 0-8.56-6.94-15.5-15.5-15.5h-10.09c-4.11 0-8.05-1.63-10.96-4.54l-6.92-6.92a15.493 15.493 0 0 0-10.96-4.54H199.5c-8.56 0-15.5-6.94-15.5-15.5v-4.4c0-7.11 4.84-13.31 11.74-15.04l14.45-3.61c3.74-.94 7-3.23 9.14-6.44l8.08-12.11c2.87-4.31 7.71-6.9 12.89-6.9h24.21c8.56 0 15.5-6.94 15.5-15.5v-21.7C359.23 71.63 422.86 131.02 441.93 208H423.5c-8.56 0-15.5 6.94-15.5 15.5z'></path></svg>";
                }
                string = value.substring(0, value.indexOf("%%"));

                var re = new RegExp("<b> </b>", "g");
                var re1 = new RegExp("[ ]", "g");
                string = string.replace(re, " ");

                return string + icon;
              },
            },
          });
        }
        //clear dates when destinations change
        $self.on("change", function () {
          $("#flightDepart").val("");
          $("#flightReturn").val("");
        });
        if (selectedDestinations) {
          $(this)
            .val(
              $(this).attr("id") === "flightFrom"
                ? selectedDestinations.from
                : selectedDestinations.to
            )
            .trigger("change");
          selectedFrom = selectedDestinations.from;
          $(this).parents("label").addClass("focused");
          if ($(this).val().trim() != "")
            updateSelectedDSTcss($(this).attr("id"), true);
        }
      });
    }
  );

  function clearText(id) {
    if ($("#" + id).val().length == 0) {
      $("#" + id).val(" ");
    }
  }
  var selectedFrom1 = "";
  var selectedTo1 = "";
  function fetchDatesOnChange(override) {
    if (override == undefined) override = false;
    if (isDoubleClicked($("#flightDepart"))) return;
    fromDst = $("#flightFrom").val();
    toDst = $("#flightTo").val();
    if (
      (fromDst != " " &&
        toDst != "" &&
        (selectedFrom1 != fromDst || selectedTo1 != toDst)) ||
      override
    ) {
      searchCalendar = [];
      searchCalendarReturn = [];
      fetchDates("OW", true);
      selectedFrom1 = fromDst;
      selectedTo1 = toDst;
      $("#flightDepart").val("");
      $("#flightReturn").val("");
      $("#flightDepart_mobile").val("");
      $("#flightReturn_mobile").val("");
    }
  }

  $("#enginePanel_flight").on(
    "mousedown",
    ".easy-autocomplete-container ul li",
    function (e) {
      e.preventDefault();
      //prevent cases when the click is not defined and you need to open the destinations and click again
      if (!$(e.target).hasClass("eac-item")) {
        $(this)
          .closest(".easy-autocomplete")
          .find("input")
          .val($(this).find(".eac-item").text());
        updateSelectedDSTcss(
          $(this).closest(".easy-autocomplete").find("input").attr("id"),
          true
        );
        $(this).find(".eac-item").trigger("mousedown");
      }
      if ($("#flightFrom").val().trim() != "") {
        updateSelectedDSTcss("flightFrom", true);
        $("#flightTo").prop("disabled", false);
      }
      if ($("#flightTo").val().trim() != "")
        updateSelectedDSTcss("flightTo", true);
      fromAutoComplete();

      //close destination list
      $(this).closest(".easy-autocomplete").find("input").trigger("blur");
    }
  );
  var selectedFrom = "";

  var autoDstToField = true;
  storeInSession("sitesettings", "get", false, "autodsttofield", function (value) {
    autoDstToField = String(value).trim() !== "false";
    $("body").toggleClass("auto-dst-to-field-disabled", !autoDstToField);
  });

  function fromAutoComplete(blur) {
    if (typeof blur == "undefined") blur = false;
    if (getDSTcodeByName($("#flightFrom").val()) != "") {
      $("#flightFrom").parent().parent().next().css("display", "block");
    }
    if (
      getDSTcodeByName($("#flightFrom").val()) != "" &&
      $("#flightFrom").val() != selectedFrom
    ) {
      const companyid = $("#companyid").val();
      if (companyid != "323" && companyid != "598") {
        //No loader in chair and chair test company
        showAeroLoader();
      }
      $("#flightTo").val("");
      updateSelectedDSTcss("flightTo", false);
      $("#eac-container-flightFrom ul").css("display", "none");
      callController(
        "general",
        "destinations",
        "destination=" + getDSTcodeByName($("#flightFrom").val()),
        false,
        false,
        function (destinations) {
          $('input[id="type_RT"]').removeClass("disabled");
          $('input[id="type_RT"]').prop("disabled", "");
          if (
            globalSightseeing &&
            $("#defaultSearch").val() == "RT" &&
            tripType == "OW"
          ) {
            $(".flightType select option[value='RT']").prop("selected", true);
            $(".flightType select").trigger("change");

            $(".flightType .comboHolder select option[value='RT']").prop(
              "selected",
              true
            );
            $(".flightType .comboHolder select").trigger("change");

            $('input[id="type_RT"]').prop("checked", true);
            $('input[id="type_RT"]').trigger("click");

            $(".flightType .sameBagSearch").trigger("click");
          }
          globalSightseeing = false;
          setTimeout(function () {
            if (!searchCalendarReturnFetching) hideAeroLoader();
          }, 500);
          var localDestinations = JSON.parse(destinations);
          returnDestinations = localDestinations;
          selfTo = $("#flightTo");
          selfTo.on("focus", function () {
            $(this).parents("label").addClass("focused");
            // closePassengers();
            closeDates();
            var e = jQuery.Event("keyup");
            e.which = 0; //choose the one you want
            e.keyCode = 0;
            var value = $(this).val() !== "" ? $(this).val() : " ";
            $(this).val(value).trigger(e);
            $(this).parents("label").addClass("focused");
          });
          if (!isUserFromMobile()) {
            selfTo.easyAutocomplete({
              data: localDestinations,
              getValue: function (element) {
                return element.name + " %% " + element.code;
              },
              list: {
                maxNumberOfElements: 100,
                onShowListEvent: function () {
                  selfTo.parents("label").addClass("focused");
                  isThereKiwi = false;
                  localDestinations.forEach(function (dst) {
                    if (dst.icon) {
                      isThereKiwi = true;
                    }
                  });
                  if (
                    selfTo
                      .siblings(".easy-autocomplete-container")
                      .find(".globeRemark").length <= 0 &&
                    isThereKiwi
                  )
                    selfTo
                      .siblings(".easy-autocomplete-container")
                      .find("ul")
                      .append(
                        "<div class='globeRemark'><svg aria-hidden='false' fill='#ffffff' focusable='false' data-prefix='fas' data-icon='globe-africa' class='svg-inline--fa fa-globe-africa fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 650 750'><path fill='currentColor' d='M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm160 215.5v6.93c0 5.87-3.32 11.24-8.57 13.86l-15.39 7.7a15.485 15.485 0 0 1-15.53-.97l-18.21-12.14a15.52 15.52 0 0 0-13.5-1.81l-2.65.88c-9.7 3.23-13.66 14.79-7.99 23.3l13.24 19.86c2.87 4.31 7.71 6.9 12.89 6.9h8.21c8.56 0 15.5 6.94 15.5 15.5v11.34c0 3.35-1.09 6.62-3.1 9.3l-18.74 24.98c-1.42 1.9-2.39 4.1-2.83 6.43l-4.3 22.83c-.62 3.29-2.29 6.29-4.76 8.56a159.608 159.608 0 0 0-25 29.16l-13.03 19.55a27.756 27.756 0 0 1-23.09 12.36c-10.51 0-20.12-5.94-24.82-15.34a78.902 78.902 0 0 1-8.33-35.29V367.5c0-8.56-6.94-15.5-15.5-15.5h-25.88c-14.49 0-28.38-5.76-38.63-16a54.659 54.659 0 0 1-16-38.63v-14.06c0-17.19 8.1-33.38 21.85-43.7l27.58-20.69a54.663 54.663 0 0 1 32.78-10.93h.89c8.48 0 16.85 1.97 24.43 5.77l14.72 7.36c3.68 1.84 7.93 2.14 11.83.84l47.31-15.77c6.33-2.11 10.6-8.03 10.6-14.7 0-8.56-6.94-15.5-15.5-15.5h-10.09c-4.11 0-8.05-1.63-10.96-4.54l-6.92-6.92a15.493 15.493 0 0 0-10.96-4.54H199.5c-8.56 0-15.5-6.94-15.5-15.5v-4.4c0-7.11 4.84-13.31 11.74-15.04l14.45-3.61c3.74-.94 7-3.23 9.14-6.44l8.08-12.11c2.87-4.31 7.71-6.9 12.89-6.9h24.21c8.56 0 15.5-6.94 15.5-15.5v-21.7C359.23 71.63 422.86 131.02 441.93 208H423.5c-8.56 0-15.5 6.94-15.5 15.5z'></path></svg><span>" +
                        $("#otherAirline").val() +
                        "</span></div>"
                      );
                },
                onHideListEvent: function () {
                  //                      $self.parents('label').removeClass('focused');
                  if (selfTo.val() != "")
                    selfTo.parents("label").addClass("filled");
                },
                onChooseEvent: function () {
                  selfTo.val(selfTo.getSelectedItemData().name);
                  updateSelectedDSTcss("flightTo", true);
                  $(selfTo).trigger("click");
                },
                onSelectItemEvent: function () {
                  selfTo.val(selfTo.getSelectedItemData().name);
                },
                match: { enabled: true },
                onMouseOverEvent: function () {
                  updateSelectedDSTcss($(selfTo).attr("id"));
                },
              },
              template: {
                type: "custom",
                method: function (value, item) {
                  var icon = "";
                  if (item.icon) {
                    icon =
                      "<svg aria-hidden='false' fill='#ffffff' focusable='false' data-prefix='fas' data-icon='globe-africa' class='svg-inline--fa fa-globe-africa fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 650 600'><path fill='currentColor' d='M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm160 215.5v6.93c0 5.87-3.32 11.24-8.57 13.86l-15.39 7.7a15.485 15.485 0 0 1-15.53-.97l-18.21-12.14a15.52 15.52 0 0 0-13.5-1.81l-2.65.88c-9.7 3.23-13.66 14.79-7.99 23.3l13.24 19.86c2.87 4.31 7.71 6.9 12.89 6.9h8.21c8.56 0 15.5 6.94 15.5 15.5v11.34c0 3.35-1.09 6.62-3.1 9.3l-18.74 24.98c-1.42 1.9-2.39 4.1-2.83 6.43l-4.3 22.83c-.62 3.29-2.29 6.29-4.76 8.56a159.608 159.608 0 0 0-25 29.16l-13.03 19.55a27.756 27.756 0 0 1-23.09 12.36c-10.51 0-20.12-5.94-24.82-15.34a78.902 78.902 0 0 1-8.33-35.29V367.5c0-8.56-6.94-15.5-15.5-15.5h-25.88c-14.49 0-28.38-5.76-38.63-16a54.659 54.659 0 0 1-16-38.63v-14.06c0-17.19 8.1-33.38 21.85-43.7l27.58-20.69a54.663 54.663 0 0 1 32.78-10.93h.89c8.48 0 16.85 1.97 24.43 5.77l14.72 7.36c3.68 1.84 7.93 2.14 11.83.84l47.31-15.77c6.33-2.11 10.6-8.03 10.6-14.7 0-8.56-6.94-15.5-15.5-15.5h-10.09c-4.11 0-8.05-1.63-10.96-4.54l-6.92-6.92a15.493 15.493 0 0 0-10.96-4.54H199.5c-8.56 0-15.5-6.94-15.5-15.5v-4.4c0-7.11 4.84-13.31 11.74-15.04l14.45-3.61c3.74-.94 7-3.23 9.14-6.44l8.08-12.11c2.87-4.31 7.71-6.9 12.89-6.9h24.21c8.56 0 15.5-6.94 15.5-15.5v-21.7C359.23 71.63 422.86 131.02 441.93 208H423.5c-8.56 0-15.5 6.94-15.5 15.5z'></path></svg>";
                  }
                  string = value.substring(0, value.indexOf("%%"));
                  var re = new RegExp("<b> </b>", "g");
                  var re1 = new RegExp("[ ]", "g");
                  string = string.replace(re, " ");

                  return string + icon;
                },
              },
            });
          } else {
            selfTo.easyAutocomplete({
              data: localDestinations,
              getValue: function (element) {
                return element.name + " %% " + element.code;
              },
              list: {
                maxNumberOfElements: 100,
                onShowListEvent: function () {
                  selfTo.parents("label").addClass("focused");
                  isThereKiwi = false;
                  localDestinations.forEach(function (dst) {
                    if (dst.icon) {
                      isThereKiwi = true;
                    }
                  });
                  if (
                    selfTo
                      .siblings(".easy-autocomplete-container")
                      .find(".globeRemark").length <= 0 &&
                    isThereKiwi
                  )
                    selfTo
                      .siblings(".easy-autocomplete-container")
                      .find("ul")
                      .append(
                        "<div class='globeRemark'><svg aria-hidden='false' fill='#ffffff' focusable='false' data-prefix='fas' data-icon='globe-africa' class='svg-inline--fa fa-globe-africa fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 650 750'><path fill='currentColor' d='M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm160 215.5v6.93c0 5.87-3.32 11.24-8.57 13.86l-15.39 7.7a15.485 15.485 0 0 1-15.53-.97l-18.21-12.14a15.52 15.52 0 0 0-13.5-1.81l-2.65.88c-9.7 3.23-13.66 14.79-7.99 23.3l13.24 19.86c2.87 4.31 7.71 6.9 12.89 6.9h8.21c8.56 0 15.5 6.94 15.5 15.5v11.34c0 3.35-1.09 6.62-3.1 9.3l-18.74 24.98c-1.42 1.9-2.39 4.1-2.83 6.43l-4.3 22.83c-.62 3.29-2.29 6.29-4.76 8.56a159.608 159.608 0 0 0-25 29.16l-13.03 19.55a27.756 27.756 0 0 1-23.09 12.36c-10.51 0-20.12-5.94-24.82-15.34a78.902 78.902 0 0 1-8.33-35.29V367.5c0-8.56-6.94-15.5-15.5-15.5h-25.88c-14.49 0-28.38-5.76-38.63-16a54.659 54.659 0 0 1-16-38.63v-14.06c0-17.19 8.1-33.38 21.85-43.7l27.58-20.69a54.663 54.663 0 0 1 32.78-10.93h.89c8.48 0 16.85 1.97 24.43 5.77l14.72 7.36c3.68 1.84 7.93 2.14 11.83.84l47.31-15.77c6.33-2.11 10.6-8.03 10.6-14.7 0-8.56-6.94-15.5-15.5-15.5h-10.09c-4.11 0-8.05-1.63-10.96-4.54l-6.92-6.92a15.493 15.493 0 0 0-10.96-4.54H199.5c-8.56 0-15.5-6.94-15.5-15.5v-4.4c0-7.11 4.84-13.31 11.74-15.04l14.45-3.61c3.74-.94 7-3.23 9.14-6.44l8.08-12.11c2.87-4.31 7.71-6.9 12.89-6.9h24.21c8.56 0 15.5-6.94 15.5-15.5v-21.7C359.23 71.63 422.86 131.02 441.93 208H423.5c-8.56 0-15.5 6.94-15.5 15.5z'></path></svg><span>" +
                        $("#otherAirline").val() +
                        "</span></div>"
                      );
                },
                onHideListEvent: function () {
                  //                      $self.parents('label').removeClass('focused');
                  if (selfTo.val() != "")
                    selfTo.parents("label").addClass("filled");
                },
                onChooseEvent: function () {
                  selfTo.val(selfTo.getSelectedItemData().name);
                  updateSelectedDSTcss("flightTo", true);
                  $(selfTo).trigger("click");
                },
                onSelectItemEvent: function () {
                  selfTo.val(selfTo.getSelectedItemData().name);
                },
                match: { enabled: true },
              },
              template: {
                type: "custom",
                method: function (value, item) {
                  var icon = "";
                  if (item.icon) {
                    icon =
                      "<svg aria-hidden='false' fill='#ffffff' focusable='false' data-prefix='fas' data-icon='globe-africa' class='svg-inline--fa fa-globe-africa fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 650 600'><path fill='currentColor' d='M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm160 215.5v6.93c0 5.87-3.32 11.24-8.57 13.86l-15.39 7.7a15.485 15.485 0 0 1-15.53-.97l-18.21-12.14a15.52 15.52 0 0 0-13.5-1.81l-2.65.88c-9.7 3.23-13.66 14.79-7.99 23.3l13.24 19.86c2.87 4.31 7.71 6.9 12.89 6.9h8.21c8.56 0 15.5 6.94 15.5 15.5v11.34c0 3.35-1.09 6.62-3.1 9.3l-18.74 24.98c-1.42 1.9-2.39 4.1-2.83 6.43l-4.3 22.83c-.62 3.29-2.29 6.29-4.76 8.56a159.608 159.608 0 0 0-25 29.16l-13.03 19.55a27.756 27.756 0 0 1-23.09 12.36c-10.51 0-20.12-5.94-24.82-15.34a78.902 78.902 0 0 1-8.33-35.29V367.5c0-8.56-6.94-15.5-15.5-15.5h-25.88c-14.49 0-28.38-5.76-38.63-16a54.659 54.659 0 0 1-16-38.63v-14.06c0-17.19 8.1-33.38 21.85-43.7l27.58-20.69a54.663 54.663 0 0 1 32.78-10.93h.89c8.48 0 16.85 1.97 24.43 5.77l14.72 7.36c3.68 1.84 7.93 2.14 11.83.84l47.31-15.77c6.33-2.11 10.6-8.03 10.6-14.7 0-8.56-6.94-15.5-15.5-15.5h-10.09c-4.11 0-8.05-1.63-10.96-4.54l-6.92-6.92a15.493 15.493 0 0 0-10.96-4.54H199.5c-8.56 0-15.5-6.94-15.5-15.5v-4.4c0-7.11 4.84-13.31 11.74-15.04l14.45-3.61c3.74-.94 7-3.23 9.14-6.44l8.08-12.11c2.87-4.31 7.71-6.9 12.89-6.9h24.21c8.56 0 15.5-6.94 15.5-15.5v-21.7C359.23 71.63 422.86 131.02 441.93 208H423.5c-8.56 0-15.5 6.94-15.5 15.5z'></path></svg>";
                  }
                  string = value.substring(0, value.indexOf("%%"));
                  var re = new RegExp("<b> </b>", "g");
                  var re1 = new RegExp("[ ]", "g");
                  string = string.replace(re, " ");

                  return string + icon;
                },
              },
            });
          }

          if (autoDstToField && selfTo.val() === "" && !blur) selfTo.trigger("focus");

          if (
            returnDestinations[0].sightseeingAutoFill != undefined &&
            returnDestinations[0].sightseeingAutoFill
          ) {
            //Init the global sightseeing destination array, In order to save the set up sightseeing destination, When user clicks on "Switch" button
            if (globalSightseeingDestination.length == 0) {
              globalSightseeingDestination.push($("#flightFrom").val());
              globalSightseeingDestination.push(returnDestinations[0].name);
            }

            selfTo.val(returnDestinations[0].name);
            updateSelectedDSTcss("flightTo", true);
            $(selfTo).trigger("click");

            if ($(".flightType option:selected").val() != "OW") {
              $(".flightType select option[value='OW']").prop("selected", true);
              $(".flightType select").trigger("change");
            }
            if (
              $(".flightType .comboHolder select option:selected").val() != "OW"
            ) {
              $(".flightType .comboHolder select option[value='OW']").prop(
                "selected",
                true
              );
              $(".flightType .comboHolder select").trigger("change");
            }
            if ($('input[id="type_RT"]').prop("checked")) {
              $('input[id="type_OW"]').prop("checked", true);
              $('input[id="type_OW"]').trigger("click");
            }
            if (tripType == "RT") {
              $(".flightType .sameBagSearch").trigger("click");
            }

            $(".flightType .comboHolder select").prop("disabled", "disabled");
            $(".flightType select").prop("disabled", "disabled");
            $('input[id="type_RT"]').addClass("disabled");
            $('input[id="type_RT"]').prop("disabled", "disabled");

            globalSightseeing = true;
            fetchDates("OW", true);
          }

          selfTo.on("change", function () {
            if (toDST == $(this).val() || toDST == "") return;

            //Remove any old flight results if exists
            searchCalendar = [];
            searchCalendarReturn = [];
            selectedOutKey = 0;
            selectedInKey = 0;
            minimumKey = 0;
            xmlHttps.forEach(function (request) {
              request.abort();
            });
            searchCalendarFetching = false;
            searchCalendarReturnFetching = false;
          });
        }
      );
    }
    if (
      $("#flightFrom").val() === $("#flightTo").val() &&
      $("#flightFrom").val() !== ""
    ) {
      $("#flightTo").val("");
    }
    selectedFrom = $("#flightFrom").val();
    fetchDatesOnChange();
    //    });
  }
  //$('#flightTo').on('change',function(){
  function toAutoComplete() {
    if (getDSTcodeByName($("#flightTo").val()) != "") {
      $("#flightTo").parent().parent().next().css("display", "block");
      $("#eac-container-flightTo ul").css("display", "none");
    } else {
      $("#eac-container-flightTo ul").css("display", "block");
    }
    //If from & to are not empty and not the same destination
    if (
      !firstLoad &&
      getDSTcodeByName($("#flightFrom").val()) !== "" &&
      getDSTcodeByName($("#flightTo").val()) !== "" &&
      getDSTcodeByName($("#flightFrom").val()) !==
      getDSTcodeByName($("#flightTo").val())
    ) {
      fetchDatesOnChange();
    }
    //});
  }
  $(".flightForm li label input")
    .not(".uprightEngine_frame .flightForm li label input")
    .on("focus", function () {
      if ($(this).hasClass("disabled")) return false;
      //if(getViewport_width()>767) $('html, body').animate({scrollTop: $(this).offset().top-10}, 100);
    });
  $(".flightForm li label input").on("blur", function () {
    if ($(this).val() == "") {
      $(this).parents("label").removeClass("focused");
      $(this).parents("label").removeClass("filled");
    } else {
      $(this).parents("label").addClass("filled");
      $(this).parents("label").removeClass("focused");
    }
  });
  $(".flightForm li label input").trigger("blur");

  var openerInput = 0;
  $(".flightForm_popClose").on("click", function () {
    $("#overlay").attr("aria-hidden", "true");
    $("#flightForm_pop").attr("aria-hidden", "true");
    $(".flightForm li label input").trigger("blur");

    $("html").removeClass("popOpen");
    $("body").removeClass("popOpen");
    return false;
  });
  $(".flightForm_popConfirm button").on("click", function () {
    $("#overlay").attr("aria-hidden", "true");
    $("#flightForm_pop").attr("aria-hidden", "true");
    $(openerInput).val($("#flightForm_popInput").val());
    $(".flightForm li label input").trigger("blur");

    $("html").removeClass("popOpen");
    $("body").removeClass("popOpen");
    return false;
  });

  $("#flightDepart, #flightReturn").on("focus", function () {
    isDoubleClicked($(this));
    if (
      $(this).hasClass("disabled") ||
      $("#flightFrom").val() == "" ||
      $("#flightFrom").val() == " " ||
      $("#flightTo").val() == "" ||
      $("#flightTo").val() == " "
    ) {
      return false;
    }
    // closePassengers();
    if (
      typeof toDst != "undefined" &&
      toDst != undefined &&
      toDst != $("#flightTo").val()
    ) {
      toDst = $("#flightTo").val();
      searchCalendar = [];
      searchCalendarReturn = [];
      selectedOutKey = 0;
      selectedInKey = 0;
      minimumKey = 0;
      xmlHttps.forEach(function (request) {
        request.abort();
      });
      searchCalendarFetching = false;
      searchCalendarReturnFetching = false;
      fetchDates("OW", true);
      $("#flightDepart").trigger("focus");
      return false;
    }
    //prevent going to return calendar if depart date is not chosen
    if ($(this).attr("id") == "flightReturn" && $("#flightDepart").val() == "")

      // $(this).css("display", "");
      $("#flightDepart").trigger("focus");

    if ($(this).attr("id") == "flightDepart") {
      direction = "out";
      selectedKey = selectedOutKey;
      $("#flightForm_datePop1 .flightForm_datePrevMonth").removeClass(
        "disabled"
      );
    } else {
      direction = "in";
      selectedKey = selectedInKey;
      if (searchCalendarReturnFetching) showAeroLoader();
    }

    //Make sure that we have a valid calendar for the direction and that there is not a search in progress and that we have results
    if (
      ((direction == "out" && searchCalendar.length > 0) ||
        (direction == "in" && searchCalendarReturn.length > 0)) &&
      !searchCalendarFetching &&
      !searchCalendarReturnFetching
    ) {
      organizeSearchCalendar(selectedKey, direction);
      // if (searchCalendarReturnFetching)
    } else {
      if (
        direction != "in" &&
        !searchCalendarFetching &&
        !searchCalendarReturnFetching
      )
        fetchDates("all", true);
    }
    //}
    if (getViewport_width() > 767) {
      $(".flightForm_dateInput").removeClass("focused");
      $(this).parents("label").addClass("focused");
      openerInput = this;
      $("#flightForm_datePop1")
        .slideDown()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "false");
          // $(this).css("display", "");
        });
    } else {
      $("#overlay").attr("aria-hidden", "false");
      $("#flightForm_datePop1").attr("aria-hidden", "false");
      $("html").addClass("popOpen");
      $("body").addClass("popOpen");
    }
  });
  $("#flightForm_datePop1 .flightForm_dateClose").on("click", function () {
    if (getViewport_width() > 767) {
      $("#flightForm_datePop1")
        .slideUp()
        .promise()
        .done(function () {
          $(".flightForm_passengers").focus();
          $(".flightForm_datePop").attr("aria-hidden", "true");
          $("#flightDepart, #flightReturn").trigger("blur");
        });
    } else {
      $("#overlay").attr("aria-hidden", "true");
      $("#flightForm_datePop1").attr("aria-hidden", "true");
      $("#flightDepart, #flightReturn").trigger("blur");

      $("html").removeClass("popOpen");
      $("body").removeClass("popOpen");
    }
    return false;
  });

  try {
    if ($(".flightType").attr("toggle") == "1") {
      if (tripType == "RT") {
        $(".flightType .sameBagSearch")
          .children(".toggleBtn")
          .removeClass("on");
        $(".flightType .sameBagSearch").attr("aria-expanded", "true");
        $("#type_RT").show();
        $("#type_OW").hide();
      } else {
        $(".flightType .sameBagSearch").children(".toggleBtn").addClass("on");
        $(".flightType .sameBagSearch").attr("aria-expanded", "false");
        $("#type_RT").hide();
        $("#type_OW").show();
      }
      //in case of vertical style we need to restyle the toggle button
      if ($(".flightType").attr("horizontal") !== "1") {
        if ($(window).width() < 768) {
          $($(".flightType .sameBagSearch .sameBagT").get().reverse()).each(
            function () {
              $(this).insertAfter($("#bagBtn"));
            }
          );
        }
        $(window).resize(function () {
          if ($(window).width() < 768) {
            $($(".flightType .sameBagSearch .sameBagT").get().reverse()).each(
              function () {
                $(this).insertAfter($("#bagBtn"));
              }
            );
          } else {
            $("#bagBtn").insertAfter(
              $(".flightType .sameBagSearch .sameBagT").last()
            );
          }
        });
      }
    } else if ($('input[name="tripType"]').length > 1) {
      $("#type_" + tripType).prop("checked", true);
    }
    if (tripType !== "RT") {
      $("#enginePanel_flight .flightForm_dateLI:eq(1)").addClass("disabled");
      $("#flightReturn").addClass("disabled");
    }

    $(
      '.flightType .sameBagSearch, input[id="type_RT"], input[id="type_OW"]'
    ).on("click", function (e) {
      if ($(this).attr("id") != "type_RT" && $(this).attr("id") != "type_OW") {
        e.preventDefault();
        if ($(this).attr("aria-expanded") == "false") {
          $(this).children(".toggleBtn").removeClass("on");
          $(this).attr("aria-expanded", "true");
          $("#type_RT").show();
          $("#type_OW").hide();
        } else {
          $(this).children(".toggleBtn").addClass("on");
          $(this).attr("aria-expanded", "false");
          $("#type_RT").hide();
          $("#type_OW").show();
        }
        $(".flightType .sameBagSearch .sameBagT").each(function () {
          if ($(this).css("display") !== "none")
            tripType = $(this).attr("type");
        });
      } else {
        tripType = $(this).val();
      }
      showAeroLoader();
      if (tripType === "MD") {
        window.open("//" + $(this).attr("data-mdurl"));
      } else {
        if (tripType === "OW") {
          $("#enginePanel_flight .flightForm_dateLI:eq(1)").addClass(
            "disabled"
          );
          $("#flightReturn").addClass("disabled");
          $("#enginePanel_flight .flightForm_dateInput:eq(1)").addClass(
            "disabled"
          );
          $("#flightReturn_mobile")
            .addClass("disabled")
            .removeClass("focused")
            .val("");
        } else {
          $("#enginePanel_flight .flightForm_dateLI:eq(1)").removeClass(
            "disabled"
          );
          $("#flightReturn").removeClass("disabled");
          $("#enginePanel_flight .flightForm_dateInput:eq(1)").removeClass(
            "disabled"
          );
          $("#flightReturn_mobile").removeClass("disabled").addClass("focused");
        }
      }
      $("#flightReturn").val("");
      $("#flightDepart").val("");

      xmlHttps.forEach(function (request) {
        request.abort();
      });
      searchCalendarFetching = false;
      searchCalendarReturnFetching = false;
      lastDateRequested = false;
      if (calendarPricesOnReturn == "1") {
        fetchDatesOnChange(true);
        $("#flightDepart").val("").trigger("blur");
      }
      fetchDates($("#flightDepart").val() == "" ? "OW" : "RT", true, true);
      setTimeout(function () {
        hideAeroLoader();
      }, 700);
    });

    $(".flightType .comboHolder").on("change", function () {
      showAeroLoader();
      if (tripType == $(".flightType .comboHolder").children().val()) {
        setTimeout(function () {
          hideAeroLoader();
        }, 700);
        return;
      }
      tripType = $(".flightType .comboHolder option:selected")
        .val()
        .toUpperCase();
      if (tripType === "MD") {
        window.open("//" + $(this).attr("data-mdurl"));
      } else {
        if (tripType == "OW") {
          $("#enginePanel_flight .flightForm_dateLI:eq(1)").addClass(
            "disabled"
          );
          $("#flightReturn").addClass("disabled");
          $("#enginePanel_flight .flightForm_dateInput:eq(1)").addClass(
            "disabled"
          );
          $("#flightReturn_mobile")
            .addClass("disabled")
            .removeClass("focused")
            .val("");
        } else {
          $("#enginePanel_flight .flightForm_dateLI:eq(1)").removeClass(
            "disabled"
          );
          $("#flightReturn").removeClass("disabled");
          $("#enginePanel_flight .flightForm_dateInput:eq(1)").removeClass(
            "disabled"
          );
          $("#flightReturn_mobile").removeClass("disabled").addClass("focused");
        }
      }
      $("#flightReturn").val("");
      $("#flightDepart").val("");

      //searchCalendar = false;
      //searchCalendarReturn = false;
      xmlHttps.forEach(function (request) {
        request.abort();
      });
      searchCalendarFetching = false;
      searchCalendarReturnFetching = false;
      lastDateRequested = false;
      if (calendarPricesOnReturn == "1") {
        fetchDatesOnChange(true);
        $("#flightDepart").val("").trigger("blur");
      }
      fetchDates($("#flightDepart").val() == "" ? "OW" : "RT", true, true);
      setTimeout(function () {
        hideAeroLoader();
      }, 700);
    });
    $(".flightType").on("click", function () {
      var $select = $(this).find("select");
      $select.trigger("open");
    });
  } catch (err) {
    logError(err);
  }

  $("#flightForm_passengers , #flightForm_passengers_vi").on(
    "focus",
    function () {
      closeDates();
      $(this).parents("label").addClass("focused");
      $("#" + $(this).attr("aria-controls"))
        .slideDown()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "false");
          $(this).css("display", "");
        });
    }
  );
  $("a.passPop_plus").on("click", function () {
    var usechargetype =
      $("#passChargeType").length > 0 ||
        $('input[name="passChargeType"]').length > 0
        ? true
        : false;
    if ($(this).hasClass("disabled")) return false;
    var form = $(this).closest(".flightForm_passPop");

    if ($(form).find("input.passAdults").length > 1) {
      var adults = 0;
      $(form)
        .find("input.passAdults")
        .each(function () {
          adults += parseInt($(this).val());
        });
    } else {
      var adults = $(form).find("input.passAdults").val();
    }
    if ($(form).find("input.passChildren").length > 1) {
      var children = 0;
      $(form)
        .find("input.passChildren")
        .each(function () {
          children += parseInt($(this).val());
        });
    } else {
      var children = $(form).find("input.passChildren").val();
    }
    if ($(form).find("input.passInfants").length > 1) {
      var infants = 0;
      $(form)
        .find("input.passInfants")
        .each(function () {
          infants += parseInt($(this).val());
        });
    } else {
      var infants = $(form).find("input.passInfants").val();
    }
    if (isNaN(infants)) infants = 0;

    var passengerInput = $("#" + $(this).attr("aria-controls"));
    var maximum = passengerInput.attr("data-max");
    currentValue = parseInt(passengerInput.val());
    //all values < maximum
    if (currentValue + 1 == maximum) {
      $(this).addClass("disabled");
    }

    //all values < 0
    if (currentValue + 1 > 0) {
      $(this).parent().find("a.passPop_minus").removeClass("disabled");
    }

    if (passengerInput.hasClass("passAdults")) {
      //Adlt >= inf
      if (
        (adults + 1 > infants &&
          $(form).find("input.passInfants").attr("data-max") > infants) ||
        infants == 0
      )
        $(form)
          .find("input.passInfants")
          .parent()
          .find("a.passPop_plus")
          .removeClass("disabled");
      if (
        usechargetype &&
        adults + 1 == 1 &&
        children < $(form).find("input.passChildren").attr("data-max")
      )
        $(form)
          .find("input.passChildren")
          .parent()
          .find("a.passPop_plus")
          .removeClass("disabled");
      //Make sure to add children in case there are adults
      if (
        adults + 1 > 0 &&
        children < $(form).find("input.passChildren").attr("data-max")
      ) {
        $(form)
          .find("input.passChildren")
          .parent()
          .find("a.passPop_plus")
          .removeClass("disabled");
      }
    }
    if (passengerInput.hasClass("passInfants")) {
      //Adlt >= inf
      if (infants >= adults) {
        $(this).addClass("disabled");
        return false;
      }
    }

    //Disable all add passengers button if we've reached total max
    if (
      $(form).find("input.passAdults").length > 1 &&
      passengerInput.hasClass("passAdults") &&
      adults + 1 >= maximum
    ) {
      $(form)
        .find("input.passAdults")
        .parent()
        .find("a.passPop_plus")
        .addClass("disabled");
    }
    if (
      $(form).find("input.passChildren").length > 1 &&
      passengerInput.hasClass("passChildren") &&
      children + 1 >= maximum
    ) {
      $(form)
        .find("input.passChildren")
        .parent()
        .find("a.passPop_plus")
        .addClass("disabled");
    }
    if (
      $(form).find("input.passInfants").length > 1 &&
      passengerInput.hasClass("passInfants") &&
      infants + 1 >= maximum
    ) {
      $(form)
        .find("input.passInfants")
        .parent()
        .find("a.passPop_plus")
        .addClass("disabled");
    }

    passengerInput.val(currentValue + 1);
    var inputval = parseInt(
      $(form)
        .closest(".flightForm_passLI")
        .find(".flightForm_passengers")
        .val()
        .split(" Passengers")
    );
    $(form)
      .closest(".flightForm_passLI")
      .find(".flightForm_passengers")
      .val(
        inputval +
        1 +
        " " +
        (Number(adults) + Number(children) + Number(infants) + 1 > 1
          ? $("#passengerTrans").val()
          : $("#onePassengerTrans").val())
      );
    if ($("#hasPaxTypes").val() === "true") {
      if (passengerInput.hasClass("passAdults")) {
        $("#passAdults").val(parseInt($("#passAdults").val()) + 1);
      }
      if (passengerInput.hasClass("passChildren")) {
        $("#passChildren").val(parseInt($("#passChildren").val()) + 1);
      }
      if (passengerInput.hasClass("passInfants")) {
        $("#passInfants").val(
          parseInt(
            $("#passInfants").val() != undefined ? $("#passInfants").val() : 0
          ) + 1
        );
      }
    }
    return false;
  });
  $("a.passPop_minus").on("click", function () {
    if ($(this).hasClass("disabled")) return false;

    var usechargetype =
      $("#passChargeType").length > 0 ||
        $('input[name="passChargeType"]').length > 0
        ? true
        : false;

    var form = $(this).closest(".flightForm_passPop");

    if ($(form).find("input.passAdults").length > 1) {
      var adults = 0;
      $(form)
        .find("input.passAdults")
        .each(function () {
          adults += parseInt($(this).val());
        });
    } else {
      var adults = $(form).find("input.passAdults").val();
    }
    if ($(form).find("input.passChildren").length > 1) {
      var children = 0;
      $(form)
        .find("input.passChildren")
        .each(function () {
          children += parseInt($(this).val());
        });
    } else {
      var children = $(form).find("input.passChildren").val();
    }
    if ($(form).find("input.passInfants").length > 1) {
      var infants = 0;
      $(form)
        .find("input.passInfants")
        .each(function () {
          infants += parseInt($(this).val());
        });
    } else {
      var infants = $(form).find("input.passInfants").val();
    }
    if (isNaN(infants)) infants = 0;

    var passengerInput = $("#" + $(this).attr("aria-controls"));
    var maximum = parseInt(passengerInput.attr("data-max"));
    var total = Number(adults) + Number(children) + Number(infants);
    var minusInf = 0;
    currentValue = parseInt(passengerInput.val());
    if (currentValue - 1 < maximum) {
      $(this).parent().find("a.passPop_plus").removeClass("disabled");
    }
    if (passengerInput.hasClass("passAdults")) {
      //Adlt >= 1
      if (
        (adults - 1 === 1 &&
          !usechargetype &&
          $(form).find("input.passChildren").attr("data-allowunaccompanied") ==
          "false" &&
          $(form).find("input.passAdults").length == 1) ||
        adults == 0
      ) {
        $(this).addClass("disabled");
      }

      if (adults - 1 < infants) {
        $(form)
          .find("input.passInfants")
          .val($(form).find("input.passInfants").val() - 1);
        minusInf--;
        if (parseInt(infants) + minusInf <= 0) {
          $(form)
            .find("input.passInfants")
            .parent()
            .find("a.passPop_minus")
            .addClass("disabled");
          $(form)
            .find("input.passInfants")
            .parent()
            .find("a.passPop_plus")
            .removeClass("disabled");
        }
      }

      //ibe-472 if adults = 0 and company doesnt allow unaccompanied minors then block the buttons
      if (
        adults - 1 == 0 &&
        $(form).find("input.passChildren").attr("data-allowunaccompanied") ==
        "false"
      ) {
        $(form)
          .find("input.passChildren")
          .parent()
          .find("a.passPop_plus")
          .addClass("disabled");
        $(form).find("input.passChildren").val(0);
        $(form)
          .find("input.passChildren")
          .parent()
          .find("a.passPop_minus")
          .addClass("disabled");
      }
    }
    if (passengerInput.hasClass("passInfants") && infants - 1 < adults) {
      $(form)
        .find("input.passInfants")
        .parent()
        .find("a.passPop_plus")
        .removeClass("disabled");
    }
    currentValue = parseInt(passengerInput.val());
    if (currentValue == 1) {
      $(this).addClass("disabled");
    }
    if (currentValue > 0) {
      passengerInput.val(currentValue - 1);
      paxNum =
        parseInt(
          $(form)
            .closest(".flightForm_passLI")
            .find(".flightForm_passengers")
            .val()
            .split(" Passengers")
        ) -
        1 +
        minusInf;
      passengerTrans =
        paxNum > 1 || paxNum == 0
          ? $("#passengerTrans").val()
          : $("#onePassengerTrans").val();
      $(form)
        .closest(".flightForm_passLI")
        .find(".flightForm_passengers")
        .val(paxNum + " " + passengerTrans);
    }
    //Disable all add passengers button if we've reached total max
    if (
      $(form).find("input.passAdults").length > 1 &&
      passengerInput.hasClass("passAdults") &&
      adults - 1 < maximum
    ) {
      $(form)
        .find("input.passAdults")
        .parent()
        .find("a.passPop_plus")
        .removeClass("disabled");
    }
    if (
      $(form).find("input.passChildren").length > 1 &&
      passengerInput.hasClass("passChildren") &&
      children - 1 < maximum
    ) {
      $(form)
        .find("input.passChildren")
        .parent()
        .find("a.passPop_plus")
        .removeClass("disabled");
    }
    if (
      $(form).find("input.passInfants").length > 1 &&
      passengerInput.hasClass("passInfants") &&
      infants - 1 < maximum
    ) {
      $(form)
        .find("input.passInfants")
        .parent()
        .find("a.passPop_plus")
        .removeClass("disabled");
    }
    if ($("#hasPaxTypes").val() === "true") {
      if (passengerInput.hasClass("passAdults")) {
        $("#passAdults").val(parseInt($("#passAdults").val()) - 1);
      }
      if (passengerInput.hasClass("passChildren")) {
        $("#passChildren").val(parseInt($("#passChildren").val()) - 1);
      }
      if (passengerInput.hasClass("passInfants")) {
        $("#passInfants").val(
          parseInt(
            $("#passInfants").val() != undefined ? $("#passInfants").val() : 0
          ) - 1
        );
      }
    }
    return false;
  });

  //if infants number is equal to adults -> disable the + button
  if ($("input#passInfants").val() >= $("input#passAdults").val()) {
    $("input.passInfants").parent().find("a.passPop_plus").addClass("disabled");
  }

  $("#passChargeType").on("change", function (e) {
    storeInSession(
      "chargetype",
      "add",
      false,
      $("#passChargeType option:selected").val(),
      function (data) { }
    );
  });

  $('input[name="passChargeType"]').on("click", function (e) {
    storeInSession(
      "chargetype",
      "add",
      false,
      $(this).val(),
      function (data) { }
    );
  });

  $("body").click(function () {
    if (getViewport_width() > 767) {
      // closePassengers();
      // closeDates();
    }
  });
  $(".flightForm_passLI, .flightForm_dateLI, .flightForm_datePop")
    .not("#flightForm_datePop_pkg")
    .click(function (e) {
      e.stopPropagation();
    });

  $("#flightForm_datePop1 .flightForm_datePrevMonth").on("click", function () {
    $("#flightForm_datePop1 .flightForm_dateNextMonth").removeClass("disabled");
    if (selectedKey === 0) {
      $(this).addClass("disabled");
    } else {
      $(this).removeClass("disabled");
      organizeSearchCalendar(--selectedKey, direction);
      if (selectedKey === 0) {
        $(this).addClass("disabled");
      }
    }
    return false;
  });

  $("#flightForm_datePop1 .flightForm_dateNextMonth").on("click", function () {
    $("#flightForm_datePop1 .flightForm_datePrevMonth").removeClass("disabled");

    if (selectedKey <= searchCalendar.length - 1 && direction == "out") {
      fetchDates("OW");
    }
    if (selectedKey <= searchCalendarReturn.length - 1 && direction == "in") {
      fetchDates("RT");
    }
    organizeSearchCalendar(++selectedKey, direction);
    return false;
  });

  $("#avl").on("click", function () {
    if (this.classList.contains("modifySearch")) {
      //clear cart when using modify search
      storeInSession("clearPreviousSearch", "add");
    }
    var isKiwi = false;
    isKiwi =
      kiwiDSTByName($("#flightFrom").val()) ||
      kiwiDSTByName($("#flightTo").val());
    var fromDst = getDSTcodeByName($("#flightFrom").val());
    var toDst = getDSTcodeByName($("#flightTo").val());
    var depart = $("#flightDepart").val();
    var arrive = tripType === "RT" ? $("#flightReturn").val() : "NA";
    var adults = $("#passAdults").val();
    var children = $("#passChildren").val();

    if($("#companyid").val()==558){
      if($("#flightFrom").val().length>0){$("#flightFrom").removeClass("BE_error");}
      if($("#flightTo").val().length>0){$("#flightTo").removeClass("BE_error");}
      if($("#flightDepart").val().length>0){$("#flightDepart").removeClass("BE_error");}
      if($("#flightReturn").val().length>0){$("#flightReturn").removeClass("BE_error");}
    }

    var infants =
      $("#passInfants").val() == undefined ? 0 : $("#passInfants").val();
    var total = Number(adults) + Number(children) + Number(infants);
    var usechargetype =
      $("#passChargeType").length > 0 ||
        $('input[name="passChargeType"]').length > 0
        ? true
        : false;
    var chargetype =
      $("#passChargeType").length > 0
        ? $("select#passChargeType option:checked").val()
        : $('input[name="passChargeType"]').length > 0
          ? $('input[name="passChargeType"]:checked').val()
          : "";
    if (
      fromDst !== "" &&
      toDst !== "" &&
      depart !== "" &&
      arrive !== "" &&
      total > 0 &&
      tripType !== "MD" &&
      fromDst !== toDst
    ) {
      showLoader();
      if (isKiwi) {
        var re = new RegExp("/", "g");
        depart = depart.replace(re, "-");
        arrive = arrive.replace(re, "-");
        window.open(
          $("#CompanyKiwiWLDomain").val() +
          "deep?affilid=" +
          $("#kiwibrandname").val() +
          "&from=" +
          fromDst +
          "&to=" +
          toDst +
          "&departure=" +
          depart +
          "&return=" +
          arrive +
          "&lang=" +
          $("#langcode").val() +
          "&currency=" +
          $("#rtname").val() +
          "&adults=" +
          adults +
          "&children=" +
          children +
          "&infants=" +
          infants,
          "_blank"
        );
        hideAeroLoader();
        return;
      }
      queryString =
        "tripType=" +
        tripType +
        "&fromDst=" +
        fromDst +
        "&toDst=" +
        toDst +
        "&start=" +
        depart +
        "&end=" +
        arrive +
        "&adults=" +
        adults +
        "&children=" +
        children +
        "&infants=" +
        infants +
        "&chargetype=" +
        chargetype;

      var breakdown = {};
      if ($("#hasPaxTypes").val() === "true") {
        var passengerTypeArr = [];
        $("ul li .passPop_form input").each(function () {
          breakdown = Object.assign(breakdown, {
            [$(this).attr("data-paxtype")]: $(this).val(),
          });
          passengerTypeArr.push({
            paxtype: $(this).attr("data-paxtype"),
            qty: parseInt($(this).val()),
          });
        });

        if (passengerTypeArr.length > 0) {
          queryString +=
            "&passengerTypeArr=" +
            encodeURIComponent(JSON.stringify(passengerTypeArr));
        }
      }

      callController(
        "general",
        "search",
        queryString,
        false,
        false,
        function (url) {
          json = JSON.parse(url);
          if (json.success) {
            const queryString =
              (json.url.includes("chargetype") ? "&" : "?") +
              "breakdown=" +
              encodeURIComponent(JSON.stringify(breakdown));

            window.top.location.href = json.url + queryString;
          }
        }
      );
    } else {
      if (fromDst === "") {
        $("#flightFrom").css("background", "rgb(232, 165, 184)");
        $("#flightFrom").addClass("BE_error");
      }
      if (toDst === "") {
        $("#flightTo").css("background", "rgb(232, 165, 184)");
        $("#flightTo").addClass("BE_error");
      }
      if (depart === "") {
        $("#flightDepart").css("background", "rgb(232, 165, 184)");
        $("#flightDepart").addClass("BE_error");
      }
      if (arrive === "") {
        $("#flightReturn").css("background", "rgb(232, 165, 184)");
        $("#flightReturn").addClass("BE_error");
      }
      if (total < 1) {
        $("#flightForm_passengers").css("background", "rgb(232, 165, 184)");
        $("#flightForm_passengers").addClass("BE_error");
      }
    }
  });
  $(
    "#flightFrom, #flightTo, #flightDepart, #flightReturn, #flightForm_passengers"
  ).on("focus", function () {
    $(this).css("background", "");
  });
  //Make sure that we can't set less than 1 passengers at first load
  $(".passPop_minus").each(function () {
    if ($("#" + $(this).attr("aria-controls")).val() < 1)
      $(this).addClass("disabled");
  });

  //in case there are more than 1 adult in search - remove default disable state
  if ($("#passAdults").val() > 1)
    $(".passAdults").siblings(".passPop_minus").removeClass("disabled");

  //Make sure we start to load the calendar only after 2 and a half seconds as to not cause delayes

  //if its widget and the coupon code was sent in the widget URL
  if ($("#widgetCoupCode").length > 0 && $("#widgetCoupCode").val() != "") {
    $(document).ready(function () {
      $(".flightCoupon_initial a")[0].click();
      $(".flightCoupon_form input").val($("#widgetCoupCode").val());
      $(".flightCoupon_form button")[0].click();
    });
  }
}

function closePassengers(e) {
  if (e != undefined) e.preventDefault();
  var passForm =
    e == undefined
      ? $(".flightForm_passPop")
      : $(e.target).closest(".flightForm_passPop");
  $(passForm).each(function (i, element) {
    if ($(element).attr("aria-hidden") == "false") {
      $(element)
        .slideUp()
        .promise()
        .done(function () {
          $(element)
            .closest(".flightForm_passLI")
            .find("input.flightForm_passengers")
            .trigger("blur");
          $(this).attr("aria-hidden", "true");
          $(this).css("display", "none");
        });
    }
  });
}

function closeDates() {
  if ($("#flightForm_datePop1").attr("aria-hidden") == "false") {
    $("#flightForm_datePop1")
      .slideUp()
      .promise()
      .done(function () {
        $("#flightDepart, #flightReturn").trigger("blur");
        $(this).attr("aria-hidden", "true");
        $(this).css("display", "");
      });
  } else if ($("#flightForm_datePop2").attr("aria-hidden") == "false") {
    $("#flightForm_datePop2")
      .slideUp()
      .promise()
      .done(function () {
        $("#flightDepart, #flightReturn").trigger("blur");
        $(this).attr("aria-hidden", "true");
        $(this).css("display", "");
      });
  } else if ($("#flightForm_datePop3").attr("aria-hidden") == "false") {
    $("#flightForm_datePop3")
      .slideUp()
      .promise()
      .done(function () {
        $("#flightDepart3").trigger("blur");
        $(this).attr("aria-hidden", "true");
        $(this).css("display", "");
      });
  }
}

if ($(".flightCoupon").exists()) {
  $(".flightCoupon_initial a").on("click", function () {
    $(this).parents(".flightCoupon_initial").attr("aria-hidden", "true");
    $(this)
      .parents(".flightCoupon_initial")
      .siblings(".flightCoupon_form")
      .fadeIn()
      .promise()
      .done(function () {
        $(this).attr("aria-hidden", "false");
        $(this).css("display", "");
      });
    $(this).parents(".flightCoupon").find("input").trigger("focus");
    return false;
  });

  $(".flightCoupon_form input").on("focus", function (e) {
    var thisval = $(this);
    $(document).on("keypress", function (e) {
      if (e.which == 13 && thisval.is(":focus")) {
        $(".flightCoupon_form input").val(thisval.val());
        $(".flightCoupon_form button")[0].click();
      }
    });
  });

  $(".flightCoupon_form button").on("click", function () {
    showAeroLoader();
    const validateCouponServiceDate = document.querySelector('[data-service-coupon-valid]')?.dataset.serviceCouponValid ?? false;
    callController(
      "bookingProcess",
      "validateCoupon",
      "couponcode=" + $(this).siblings("input").val() + "&validateCouponServiceDate=" + validateCouponServiceDate,
      false,
      false,
      function (response) {
        var result = JSON.parse(response);
        if (!result.success) {
          showCoupError(result.details.detail[0]);
          $(".flightCoupon").attr("data-valid", "false");
          $(".flightCoupon_form").removeClass("flightCoupon_formValidated");
          $(".flightCoupon_form").addClass("flightCoupon_formFailed");
        } else {
          $(".flightCoupon_form").removeClass("flightCoupon_formFailed");
          $(".flightCoupon").attr("data-valid", "true");
          $(".flightCoupon_form").addClass("flightCoupon_formValidated");

          $("#coupMsg")
            .fadeIn()
            .promise()
            .done(function () {
              $("#overlay").attr("aria-hidden", "false");
              $("#overlay").css("display", "");

              $("#coupDescription").html(result.notification);

              var new_position = $("#coupMsg").offset();
              $("html, body")
                .stop()
                .animate(
                  {
                    scrollTop: new_position.top - (20 / 100) * new_position.top,
                  },
                  500
                );
            });

          $("#closecoupMsg, #coupMsg .userPop_close").click(function () {
            $("#coupMsg")
              .fadeOut()
              .promise()
              .done(function () {
                //if its not widget or index -> reload page
                if ($("#donotrefresh").length == 0) {
                  showAeroLoader();
                  location.reload();
                  return;
                }
                hideAeroLoader();
                $("#overlay").attr("aria-hidden", "true");
                $("#overlay").css("display", "none");
              });
          });
        }
        hideAeroLoader();
      }
    );
  });
}

if (
  $("#updatedMembership").exists() &&
  $("#updatedMembership").val() == "true"
) {
  $("#overlay").attr("aria-hidden", "false");
  $("#updatedMembershipPop").attr("aria-hidden", "false");
  $("#" + $("updatedMembershipPop").attr("aria-controls"))
    .fadeIn(1400)
    .promise()
    .done(function () {
      $(this).attr("aria-hidden", "false");
      $(this).css("display", "");
      $("#updatedMembershipPop .userPop_submit input").on("click", function () {
        selfix = this;
        $("#overlay").attr("aria-hidden", "true");
        $("#" + $("updatedMembershipPop").attr("aria-controls"))
          .fadeIn(1400)
          .promise()
          .done(function () {
            $(this).attr("aria-hidden", "true");
            $("#updatedMembershipPop").attr("aria-hidden", "true");
            $(this).css("display", "");
          });
        return false;
      });
      $("#updatedMembershipPop .userPop_close").on("click", function () {
        $("#overlay").attr("aria-hidden", "true");
        $("#updatedMembershipPop").attr("aria-hidden", "true");
        return false;
      });
    });
}

$("#ock").on("click", function () {
  showAeroLoader();
  var pnrref = $("#refID2").val();
  var lastname = $("#refLastName2").val();
  var error = false;
  if (pnrref == "" || lastname == "") {
    $("#overlay").attr("aria-hidden", "false");
    $("#noReservationPop")
      .fadeIn()
      .promise()
      .done(function () {
        $("#overlay").attr("aria-hidden", "false");
        $("#overlay").css("display", "");
      });
    error = true;
    hideAeroLoader();
  }
  if (!error) {
    callController(
      "general",
      "findMyReservation",
      createQueryString(window.location.pathname, "myAccount") +
      "&pnrref=" +
      pnrref +
      "&lastname=" +
      lastname +
      "&action=reservation&subaction=checkin",
      "",
      false,
      function (data) {
        var data1 = JSON.parse(copyObj(data));
        if (!data1) {
          hideAeroLoader();
          $("#overlay").attr("aria-hidden", "false");
          $("#noReservationPop")
            .fadeIn()
            .promise()
            .done(function () {
              $("#overlay").attr("aria-hidden", "false");
              $("#overlay").css("display", "");
            });
          return;
        }

        if (data1.externalCk) {
          if (!data1.externalCkValid || !data1.url) {
            hideAeroLoader();
            handleControllerError("pop", "checkinEngine");
            return;
          }
          let externalCkUrl;
          try {
            externalCkUrl = new URL(data1.url);
          } catch (error) {
            externalCkUrl = false;
          }
          if (externalCkUrl) {
            window.location.replace(data1["url"]);
            return;
          } else {
            hideAeroLoader();
            handleControllerError("pop", "checkinEngine");
            return;
          }
        }
        if (data1.pnrUNQ !== null && data1.pnrUNQ != undefined) {
          var pnrunq = data1.pnrUNQ;
          callController(
            "general",
            "findMyReservation",
            createQueryString(window.location.pathname, "myAccount") +
            "&pnrunq=" +
            pnrunq +
            "&action=booking",
            "",
            false,
            function (data) {
              var data1 = JSON.parse(copyObj(data));
              if (data1 != null)
                storeInSession(
                  "installMybooking",
                  "add",
                  false,
                  data1,
                  function (data) {
                    if (data) {
                      storeInSession(
                        "viewsURL",
                        "add",
                        false,
                        "ckpage",
                        function (url) {
                          var url1 = JSON.parse(copyObj(url));
                          window.top.location.replace(url1 + "/" + pnrunq);
                        }
                      );
                    }
                  }
                );
              hideAeroLoader();
            }
          );
        } else {
          hideAeroLoader();
          $("#overlay").attr("aria-hidden", "false");
          $("#noReservationPop")
            .fadeIn()
            .promise()
            .done(function () {
              $("#overlay").attr("aria-hidden", "false");
              $("#overlay").css("display", "");
            });
        }
      }
    );
  }
});
$("#fnd").on("click", function () {
  showAeroLoader();
  var pnrref = $("#refID").val();
  var lastname = $("#refLastName").val();
  var error = false;
  if (pnrref == "" || lastname == "") {
    $("#overlay").attr("aria-hidden", "false");
    $("#noReservationPop")
      .fadeIn()
      .promise()
      .done(function () {
        $("#overlay").attr("aria-hidden", "false");
        $("#overlay").css("display", "");
      });
    error = true;
    hideAeroLoader();
  }
  if (!error) {
    callController(
      "general",
      "findMyReservation",
      createQueryString(window.location.pathname, "myAccount") +
      "&pnrref=" +
      pnrref +
      "&lastname=" +
      lastname +
      "&action=reservation",
      "",
      false,
      function (data) {
        var data1 = JSON.parse(copyObj(data));
        if (data1?.pnrUNQ && data1.pnrUNQ.length > 0) {
          var pnrunq = data1.pnrUNQ;
          window.top.location.replace(
            $("#homeUrl").val() + "/booking/" + pnrunq
          );
        } else {
          hideAeroLoader();
          $("#overlay").attr("aria-hidden", "false");
          $("#noReservationPop")
            .fadeIn()
            .promise()
            .done(function () {
              $("#overlay").attr("aria-hidden", "false");
              $("#overlay").css("display", "");
            });
        }
      }
    );
  }
});

$("#closeNoReservationPop").on("click", function () {
  $("#noReservationPop")
    .slideUp()
    .promise()
    .done(function () {
      $("#overlay").attr("aria-hidden", "true");
      $("#overlay").css("display", "");
      setTimeout(function () {
        hideAeroLoader();
      }, 500);
    });
});
$("a.phoneExt_toggle, a.phoneExt_toggleCK").on("click", function () {
  selfix = this;
  if (click) return false;
  click = true;
  if ($(selfix).attr("aria-expanded") == "false") {
    $(selfix).attr("aria-expanded", "true");
    $("#" + $(selfix).attr("aria-controls"))
      .slideDown()
      .promise()
      .done(function () {
        $(this).attr("aria-hidden", "false");
        click = false;
      });
  } else {
    $(selfix).attr("aria-expanded", "false");
    $("#" + $(selfix).attr("aria-controls"))
      .slideUp()
      .promise()
      .done(function () {
        $(this).attr("aria-hidden", "true");
        click = false;
      });
  }
  return false;
});
$(".passengersDetails_contactToggle input[type='checkbox']").on(
  "click",
  function () {
    selfix = this;
    if (selfix.checked) {
      $("#" + $(selfix).attr("aria-controls"))
        .slideDown()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "false");
          $(this).css("display", "");
        });
    } else {
      $("#" + $(selfix).attr("aria-controls"))
        .slideUp()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "true");
          $(this).css("display", "");
        });
    }
  }
);

if ($(".progressBar_holder").exists()) {
  function cartSetup() {
    scrollTop = $(this).scrollTop();
    originalPosition = $(".progressBar_holder").offset().top;

    if (scrollTop > originalPosition)
      $(".progressBar_cartFrame").addClass("progressBar_cartFixed");
    else $(".progressBar_cartFrame").removeClass("progressBar_cartFixed");
  }
  $(window).on("scroll", function () {
    cartSetup();
  });
  cartSetup();
}

if ($("header").exists()) {
  $("a.headerTop_toggle").on("click", function () {
    if ($(this).attr("aria-expanded") == "false") {
      $("a.headerTop_toggle, a.headerMenu_toggle").attr(
        "aria-expanded",
        "false"
      );
      $(".headerBottom_menuPop, .headerTop_pop")
        .slideUp()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "true");
          $(this).css("display", "");
        });

      if (getViewport_width() <= 1024) {
        if ($("a.headerMenu_toggleMobile").attr("aria-expanded") == "true")
          $("a.headerMenu_toggleMobile").not("#Logoff").trigger("click");
      }
      if (getViewport_width() <= 670) {
        if ($("a.loginMenu_toggleMobile").attr("aria-expanded") == "true")
          $("a.loginMenu_toggleMobile").not("#Logoff").trigger("click");
      }

      $(this).attr("aria-expanded", "true");
      $("#" + $(this).attr("aria-controls"))
        .slideDown()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "false");
          $(this).css("display", "");
        });
    } else {
      $(this).attr("aria-expanded", "false");
      $("#" + $(this).attr("aria-controls"))
        .slideUp()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "true");
          $(this).css("display", "");
        });
    }
    return false;
  });
  $("a.headerMenu_toggle").on("click", function () {
    if ($(this).attr("aria-expanded") == "false") {
      $("a.headerTop_toggle, a.headerMenu_toggle").attr(
        "aria-expanded",
        "false"
      );
      $(".headerBottom_menuPop, .headerTop_pop")
        .slideUp()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "true");
          $(this).css("display", "");
        });

      $(this).attr("aria-expanded", "true");
      $("#" + $(this).attr("aria-controls"))
        .slideDown()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "false");
          $(this).css("display", "");
        });
    } else {
      $(this).attr("aria-expanded", "false");
      $("#" + $(this).attr("aria-controls"))
        .slideUp()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "true");
          $(this).css("display", "");
        });
    }
    return false;
  });
  $("a.headerMenu_toggleMobile").on("click", function () {
    selfix = this;
    if ($(selfix).attr("aria-expanded") == "false") {
      $("a.headerTop_toggle, a.headerMenu_toggle").attr(
        "aria-expanded",
        "false"
      );
      $(".headerBottom_menuPop, .headerTop_pop")
        .slideUp()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "true");
          $(this).css("display", "");
        });
      if (getViewport_width() <= 670) {
        if ($("a.loginMenu_toggleMobile").attr("aria-expanded") == "true")
          $("a.loginMenu_toggleMobile").not("#Logoff").trigger("click");
      }

      $(selfix).attr("aria-expanded", "true");
      $("#" + $(selfix).attr("aria-controls"))
        .slideDown()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "false");
          $(this).css("display", "");
        });
    } else {
      $(selfix).attr("aria-expanded", "false");
      $("#" + $(selfix).attr("aria-controls"))
        .slideUp()
        .promise()
        .done(function () {
          $(this).removeAttr("aria-hidden");
          $(this).css("display", "");
        });
    }
    return false;
  });
  $("a.headerMenu_secToggle").on("click", function () {
    if ($(this).attr("aria-expanded") == "false") {
      $("a.headerMenu_secToggle").not(this).attr("aria-expanded", "false");
      $(".headerBottom_menuPop li ul")
        .not("#" + $(this).attr("aria-controls"))
        .slideUp()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "true");
          $(this).css("display", "");
        });
      $(this).attr("aria-expanded", "true");
      $("#" + $(this).attr("aria-controls"))
        .slideDown()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "false");
          $(this).css("display", "");
        });
    } else {
      $(this).attr("aria-expanded", "false");
      $("#" + $(this).attr("aria-controls"))
        .slideUp()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "true");
          $(this).css("display", "");
        });
    }
    return false;
  });
  $("body").click(function () {
    $("a.headerTop_toggle").each(function () {
      if ($(this).attr("aria-expanded") == "true") $(this).trigger("click");
    });
    $("a.headerMenu_toggle").each(function () {
      if ($(this).attr("aria-expanded") == "true") $(this).trigger("click");
    });
  });
}

/* inner page */
$(".headerBottom_searchButton a").on("click", function () {
  let [startDateString, endDateString] = document
    .getElementsByClassName("headerBottom_searchDate")[0]
    .innerText.split(" - ");
  document.getElementById("flightDepart").value = startDateString;
  document
    .getElementsByClassName("flightForm_dateInput")[0]
    .classList.add("filled");
  if (endDateString != undefined) {
    document.getElementById("flightReturn").value = endDateString;
    document
      .getElementsByClassName("flightForm_dateInput")[1]
      .classList.add("filled");
  }
  if ($(this).attr("aria-expanded") == "false") {
    $(this).attr("aria-expanded", "true");
    $("#" + $(this).attr("aria-controls"))
      .slideDown()
      .promise()
      .done(function () {
        $(this).attr("aria-hidden", "false");
        $(this).css("display", "");
      });
  } else {
    $(this).attr("aria-expanded", "false");
    $("#" + $(this).attr("aria-controls"))
      .slideUp()
      .promise()
      .done(function () {
        $(this).attr("aria-hidden", "true");
        $(this).css("display", "");
      });
  }
  return false;
});

$("a.enginePanel_close").on("click", function () {
  $(".headerBottom_searchButton a").trigger("click");
  return false;
});

function setup_uprightEngine() {
  if ($(".plazmaFrame").data("engine") == "uprightEngine") {
    if (getViewport_width() < 768) {
      $(".plazmaFrame").removeClass("uprightEngine");
      $(".engineFrame").removeClass("uprightEngine");
    } else {
      $(".plazmaFrame").addClass("uprightEngine");
      $(".engineFrame").addClass("uprightEngine");
    }
  }
}

$("li.currency").on("click", function () {
  showLoader();
  callController(
    "general",
    "currencyHandler",
    "checkin=" +
    (document.body.id === "checkinpage" ? "1" : "0") +
    "&currencyToChange=" +
    $(this).children("a").children("span").text(),
    false,
    false,
    async function (res) {
      // GO-2484: do not redirect rebook users back to /booking/<PNR> on currency change.
      // The session now keeps the original paid amount in default currency, so MMB math
      // stays correct across currency switches without reloading the booking.
      if (res) {
        hideAeroLoader();
        res = JSON.parse(res);
        // IBE-831 in case of limited fare currency show notice currency cant be changed
        if (res.err == "limited") {
          $("#limitedCurrPop").attr("aria-hidden", "false");

          $("#" + $("limitedCurrPop").attr("aria-controls"))
            .fadeIn(1400)
            .promise()
            .done(function () {
              $(this).attr("aria-hidden", "false");
              $(this).css("display", "");
              $("#limitedCurrPop .userPop_submit").on("click", function () {
                selfix = this;
                $("#overlay").attr("aria-hidden", "true");
                $("#" + $("limitedCurrPop").attr("aria-controls"))
                  .fadeIn(1400)
                  .promise()
                  .done(function () {
                    $(this).attr("aria-hidden", "true");
                    $("#limitedCurrPop").attr("aria-hidden", "true");
                    $(this).css("display", "");
                  });
                return false;
              });
              $("#limitedCurrPop .userPop_close").on("click", function () {
                $("#overlay").attr("aria-hidden", "true");
                $("#limitedCurrPop").attr("aria-hidden", "true");
                return false;
              });
            });
        }
      } else {
        const newPath = location.pathname.replace(
          "/" + $(".headerTop_toggle.headerTop_currency").find("span").text(),
          ""
        );
        // On /rebookFlights the query string carries pnrunq/extInf used by the carousel/date-picker;
        // preserve it across the post-currency-change reload.
        const isRebookFlightsPage =
          location.pathname.indexOf("/rebookFlights") === 0 ||
          document.body.getAttribute("data-ibepage") === "rebookflights_page";
        location.href = newPath + (isRebookFlightsPage && location.search ? location.search : "");
      }
    }
  );
});

$("li.language").on("click", function () {
  showLoader();
  baseUrl = window.location.href;
  baseUrl = baseUrl.replace("#", "");
  callController(
    "general",
    "languageHandler",
    "url=" +
    baseUrl +
    "&language=" +
    $(this).children("a").children("span").text(),
    false,
    false,
    function (json) {
      json = JSON.parse(json);
      if (json.url.charAt(json.url.length - 1) == "/")
        json.url = json.url.substring(0, json.url.length - 1);
      window.location.href = json.url;
    }
  );
});

function showCoupError(error) {
  const errorToModal = {
    invalid: "coupInvalid",
    expired: "coupExpiry",
    inapplicable: "coupInapplicable",
    invalid_route: "routeInvalid",
    invalid_usage_date: "invalidUsageDate",
  };
  const modal =
    !error || !errorToModal[error] ? errorToModal.invalid : errorToModal[error];
  handleControllerError("pop", modal);
  return false;
}

function formatFare(calendar) {
  var tmparr = calendar;
  $.each(tmparr, function (i, month) {
    if (!Array.isArray(month)) return false;
    $.each(month["days"], function (j, day) {
      tmparr[i]["days"][j]["fare"] =
        parseFloat(day["fare"]) > 999
          ? (day["fare"] / 1000).toFixed().toString() + " K"
          : day["fare"];
    });
  });
  return tmparr;
}

function organizeSearchCalendar(selectedKey, localDirection) {
  var localCalendar =
    localDirection === "in" ? searchCalendarReturn : searchCalendar;
  localCalendar = formatFare(localCalendar);
  if (
    typeof localCalendar[selectedKey] === "undefined" ||
    typeof localCalendar[selectedKey + 1] === "undefined"
  )
    return;
  $(".dateFrame").html("");
  //FIrst we inject the variables into the calendar

  if (typeof localCalendar[selectedKey + 1] !== "undefined") {
    var calendar = injectHTML(
      localCalendar[selectedKey],
      monthCalendar,
      "dateFrame",
      0
    );
    injectChildren(
      localCalendar[selectedKey].days,
      calendar,
      "dateFrame_calendar",
      "dateFrame",
      Number(0),
      true
    );
    calendar = injectHTML(
      localCalendar[selectedKey + 1],
      monthCalendar,
      "dateFrame",
      0
    );
    injectChildren(
      localCalendar[selectedKey + 1].days,
      calendar,
      "dateFrame_calendar",
      "dateFrame",
      Number(1),
      true
    );
    setupCalendarPrices(localCalendar);
  } else {
    var calendar = injectHTML(
      localCalendar[selectedKey - 1],
      monthCalendar,
      "dateFrame",
      0
    );
    injectChildren(
      localCalendar[selectedKey - 1].days,
      calendar,
      "dateFrame_calendar",
      "dateFrame",
      Number(0),
      true
    );
    calendar = injectHTML(
      localCalendar[selectedKey],
      monthCalendar,
      "dateFrame",
      0
    );
    injectChildren(
      localCalendar[selectedKey].days,
      calendar,
      "dateFrame_calendar",
      "dateFrame",
      Number(1),
      true
    );
    setupCalendarPrices(localCalendar);
  }
  $(".dateFrame_title.direction").html(
    localDirection === "in"
      ? $("#flightReturn").next("span").html()
      : $("#flightDepart").next("span").html()
  );
  if (selectedKey === 0) {
    $("#flightForm_datePop1 .flightForm_datePrevMonth").addClass("disabled");
  } else {
    $("#flightForm_datePop1 .flightForm_datePrevMonth").removeClass("disabled");
  }
  $("#flightForm_datePop1 .dateFrame_calendar a").on("click", function () {
    if ($(this).hasClass("disabled")) {
      return false;
    }
    var firstMonth = $("#dateFrameDepart").attr("data-firstmonth");
    var dayx = $(this).find("strong").text().trim();
    if (dayx.length < 2) dayx = "0" + dayx;
    var monthx = $(this).data().monthnumber;
    var yearx = $(this).data().year;
    var fromDate;
    var toDate;
    //        console.log(monthx+'/'+dayx+'/'+yearx);

    if (localDirection !== "in") {
      minimumKey = selectedKey;
      selectedOutKey = selectedKey;
      selectedInKey =
        $("#flightDepart").val() !== "" ? selectedInKey : selectedKey;
      $("#flightForm_datePop1 .flightForm_datePrevMonth").addClass("disabled");
      $(".dateFrame_month a").removeClass("startDate_selected");
      $(this).addClass("startDate_selected");
      var format =
        $("#flightDepart").attr("data-dateformat") !== ""
          ? $("#flightDepart").attr("data-dateformat")
          : "DMY";
      switch (format) {
        case "YMD":
          $("#flightDepart").val(yearx + "/" + monthx + "/" + dayx);
          $("#flightDepart_mobile").val(yearx + "/" + monthx + "/" + dayx);
          break;
        case "MDY":
          $("#flightDepart").val(monthx + "/" + dayx + "/" + yearx);
          $("#flightDepart_mobile").val(monthx + "/" + dayx + "/" + yearx);
          break;

        default: //DMY
          $("#flightDepart").val(dayx + "/" + monthx + "/" + yearx);
          $("#flightDepart_mobile").val(dayx + "/" + monthx + "/" + yearx);
          break;
      }

      $("#flightDepart")
        .parents("label")
        .removeClass("focused")
        .addClass("filled");
      if (tripType === "RT") {
        $("html").removeClass("popOpen");
        $("body").removeClass("popOpen");
        $("#flightReturn").parents("label").addClass("focused");
        $("#flightReturn").val("");
        // $("#flightReturn").trigger("focus");

        $(".flightForm_dateClose").trigger("focus");

        $("#flightReturn_mobile").addClass("focused");
      } else {
        $(".flightForm_dateClose").trigger("click");
      }
      $("#flightDepart_mobile").removeClass("focused");

      farebackup =
        $(this).attr("data-farebackup") == "false"
          ? 0
          : $(this).attr("data-farebackup");

      direction = "in";
      //$("#flightReturn_mobile").val('');
      fromDate = new Date(yearx, monthx - 1, dayx);
      //setupCalendarPrices(localCalendar);
      fetchDates("RT", true, false, firstMonth);
    } else {
      $(".dateFrame_month a").removeClass("endDate_selected");
      $(this).addClass("endDate_selected");
      var format =
        $("#flightReturn").attr("data-dateformat") !== ""
          ? $("#flightReturn").attr("data-dateformat")
          : "DMY";
      switch (format) {
        case "YMD":
          $("#flightReturn").val(yearx + "/" + monthx + "/" + dayx);
          $("#flightReturn_mobile").val(yearx + "/" + monthx + "/" + dayx);
          break;
        case "MDY":
          $("#flightReturn").val(monthx + "/" + dayx + "/" + yearx);
          $("#flightReturn_mobile").val(monthx + "/" + dayx + "/" + yearx);
          break;

        default: //DMY
          $("#flightReturn").val(dayx + "/" + monthx + "/" + yearx);
          $("#flightReturn_mobile").val(dayx + "/" + monthx + "/" + yearx);
          break;
      }
      $(".flightForm_dateClose").trigger("click");
      $("#flightDepart_mobile").addClass("focused");
      $("#flightReturn_mobile").removeClass("focused");
      selectedInKey = selectedKey;
      organizeSearchCalendar(selectedKey, localDirection);
    }
    return false;
  });
  return false;
}

function fetchDates(type, override, tripTypeChanged, firstMonth) {
  if (tripTypeChanged == undefined) tripTypeChanged = false;
  if (firstMonth == undefined) firstMonth = 0;
  firstLoad = false;
  if (
    getDSTcodeByName($("#flightFrom").val()) == "" ||
    getDSTcodeByName($("#flightTo").val()) == ""
  )
    return;
  queryString =
    "type=" +
    tripType +
    "&adults=" +
    $("#passAdults").val() +
    "&children=" +
    $("#passChildren").val() +
    "&infants=" +
    ($("#passInfants").val() == undefined ? 0 : $("#passInfants").val()) +
    "&companycalendarmonday=" +
    $("#companycalendarmonday").val();
  //Add pax breakdown
  var breakdown = {};
  if ($("#hasPaxTypes").val() === "true") {
    $("ul li .passPop_form input").each(function () {
      breakdown = Object.assign(breakdown, {
        [$(this).attr("data-paxtype")]: $(this).val(),
      });
    });
    queryString +=
      "&breakdown=" + encodeURIComponent(JSON.stringify(breakdown));
  }
  //If override we will remove all current data
  if (override && $("#flightDepart").val() == "") {
    searchCalendar = [];
    searchCalendarReturn = [];
    selectedInKey = 0;
    selectedOutKey = 0;
    minimumKey = 0;
    selectedKey = 0;
    maxMonthsNoFares = 4;
  }
  if (override && $("#flightReturn").val() == "") {
    searchCalendarReturn = [];
    selectedInKey = 0;
    selectedKey = 0;
  }

  if (tripTypeChanged && type == "OW") {
    searchCalendar = [];
    searchCalendarReturn = [];
    selectedInKey = 0;
    selectedOutKey = 0;
    minimumKey = 0;
    selectedKey = 0;
    maxMonthsNoFares = 4;
  }

  if (tripTypeChanged && type == "RT") {
    searchCalendarReturn = [];
    selectedKey = 0;
    selectedInKey = 0;
  }

  queryString +=
    "&fromDst=" +
    getDSTcodeByName($("#flightFrom").val()) +
    "&toDst=" +
    getDSTcodeByName($("#flightTo").val());
  //General search
  if (type !== "RT") {
    if (searchCalendarFetching || searchCalendarReturnFetching) return;
    //If we haven't overridden and there are already some dates - we will add to the request the last date requested
    if (searchCalendar.length > 0 && !tripTypeChanged) {
      //if (searchCalendar[searchCalendar.length-1] === lastDateRequested)
      //    return false;
      queryString += "&startDate=" + searchCalendar[searchCalendar.length - 1];
      lastDateRequested = searchCalendar[searchCalendar.length - 1];
    }
    searchCalendarFetching = true;
    showAeroLoader();
    xmlHttps.push(
      callController(
        "bookingProcess",
        "searchCalendar",
        queryString,
        "dateFrameDepart",
        true,
        function (calendarData) {
          $("#eac-container-flightTo ul").css("display", "none");
          $("#eac-container-flightFrom ul").css("display", "none");
          if (!searchCalendarReturnFetching || direction == "out")
            hideAeroLoader();
          searchCalendarFetching = false;
          try {
            var calendarResponse = JSON.parse(calendarData);
          } catch (err) {
            return;
          }
          if (calendarResponse.currencyChanged) {
            let currency = calendarResponse.currency;
            $("#rtSymbol").val(calendarResponse.rtSymbol);
            $(".headerTop_currency .headerTop_margin").html(currency);
          }
          calendarData = calendarResponse.calendar;
          resultsFromSearch = calendarResponse.hasResults;
          if (searchCalendar) {
            searchCalendar.pop();
            //Make sure we don't get duplicate values
            for (var i = 0; i < searchCalendar.length; i++) {
              if (
                searchCalendar[i].monthnumber === calendarData[0].monthnumber &&
                searchCalendar[i].year == calendarData[0].year
              ) {
                searchCalendar.splice(i, 1);
              }
            }
          }

          searchCalendar = searchCalendar.concat(calendarData);
          if (searchCalendar) {
            $("#flightForm_datePop1 .flightForm_dateNextMonth").removeClass(
              "disabled"
            );
            if (
              !$("#flightReturn").parents("label").hasClass("focused") &&
              !$("#flightReturn_mobile").hasClass("focused")
            )
              organizeSearchCalendar(selectedKey, "out");
          }
          //display calendar only fro the first month which has fares
          var isThereFlights = false;
          if (
            kiwiDSTByName($("#flightFrom").val()) ||
            kiwiDSTByName($("#flightTo").val())
          )
            isThereFlights = true;
          if (typeof calendarResponse.calendar[0] == "object") {
            Object.keys(calendarResponse.calendar[0]["days"]).forEach(function (
              j
            ) {
              if (calendarResponse.calendar[0]["days"][j]["flight"]) {
                isThereFlights = true;
              }
            });
            if (
              calendarResponse.calendar[1] != undefined &&
              calendarResponse.calendar[1] != null &&
              calendarResponse.calendar[1]["days"] != undefined &&
              calendarResponse.calendar[1]["days"] != null
            ) {
              Object.keys(calendarResponse.calendar[1]["days"]).forEach(
                function (j) {
                  if (calendarResponse.calendar[1]["days"][j]["flight"]) {
                    isThereFlights = true;
                  }
                }
              );
            }
            if (!isThereFlights && maxMonthsNoFares) {
              selectedOutKey++;
              maxMonthsNoFares--;
              $(".flightForm_dateNextMonth").trigger("click");
            }
          }
          // IBE-807 auto open calendar in case auto open calendar flag is set
          storeInSession(
            "sitesettings",
            "get",
            false,
            "autoopendateselection",
            (data) => {
              if (
                data.trim() == "true" &&
                $("#flightForm_datePop1").attr("aria-hidden") == "true"
              ) {
                $("#flightDepart").trigger("focus");
              }
            }
          );
        }
      )
    );
  }
  //RT Search
  if (type === "RT" && tripType != "OW") {
    if (searchCalendarReturnFetching) return;
    //If we haven't overridden and there are already some dates - we will add to the request the last date requested
    if (searchCalendarReturn.length > 0 && $("#flightDepart").val() == "") {
      // if (searchCalendarReturn[searchCalendarReturn.length-1] === lastDateRequested)
      //    return false;
      // if ( searchCalendarReturn.length < 12)
      //     return false;
      queryString +=
        "&startDate=" + searchCalendarReturn[searchCalendarReturn.length - 1];
      queryString += "&dateSelected=true";
      lastDateRequested = searchCalendarReturn[searchCalendarReturn.length - 1];
    } else if ($("#flightDepart").val() != "") {
      var newDepartDateStr = "";
      var dateParts = $("#flightDepart").val().split("/");
      var format =
        $("#flightDepart").attr("data-dateformat") !== ""
          ? $("#flightDepart").attr("data-dateformat")
          : "DMY";
      switch (format) {
        case "YMD":
          newDepartDateStr =
            dateParts[0] + "/" + dateParts[1] + "/" + dateParts[2];
          break;
        case "MDY":
          newDepartDateStr =
            dateParts[2] + "/" + dateParts[0] + "/" + dateParts[1];
          break;

        default: //DMY
          newDepartDateStr =
            dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
          break;
      }
      var startingDate =
        searchCalendarReturn.length > 0
          ? searchCalendarReturn[searchCalendarReturn.length - 1]
          : newDepartDateStr;
      queryString +=
        "&startDate=" +
        startingDate +
        "&chosenDate=" +
        newDepartDateStr +
        "&dateSelected=true";
      lastDateRequested = newDepartDateStr;
    }
    queryString += "&direction=RT";
    //Improvement - Always show the same 2 months
    queryString += "&firstMonthOnCalendar=" + firstMonth;
    //if we show the prices only on return then send the controller the previous selected amount
    if (farebackup !== 0) queryString += "&farebackup=" + farebackup;
    searchCalendarReturnFetching = true;
    showAeroLoader();
    xmlHttps.push(
      callController(
        "bookingProcess",
        "searchCalendar",
        queryString,
        "dateFrameReturn",
        true,
        function (calendarData) {
          if (!searchCalendarFetching || direction == "in") hideAeroLoader();
          searchCalendarReturnFetching = false;
          if (calendarData == "") return;
          var calendarResponse = JSON.parse(calendarData);
          calendarData = calendarResponse.calendar;
          resultsFromSearch = calendarResponse.hasResults;

          if (calendarResponse.currencyChanged) {
            let currency = calendarResponse.currency;
            $("#rtSymbol").val(calendarResponse.rtSymbol);
            $(".headerTop_currency .headerTop_margin").html(currency);
          }

          if (searchCalendarReturn) {
            searchCalendarReturn.pop();
            //Make sure we don't get duplicate values
            for (var i = 0; i < searchCalendarReturn.length; i++) {
              if (
                searchCalendarReturn[i].monthnumber ===
                calendarData[0].monthnumber &&
                searchCalendarReturn[i].year == calendarData[0].year
              ) {
                searchCalendarReturn.splice(i, 1);
              }
            }
          }
          searchCalendarReturn = searchCalendarReturn.concat(calendarData);
          if (searchCalendarReturn) {
            $("#flightForm_datePop1 .flightForm_dateNextMonth").removeClass(
              "disabled"
            );
            if (
              !$("#flightDepart").parents("label").hasClass("focused") &&
              !$("#flightDepart_mobile").hasClass("focused")
            ) {
              organizeSearchCalendar(selectedKey, "in");
            }
          }
          // if (!resultsFromSearch)
          //     searchCalendarReturn = false;
        }
      )
    );
  }
}

function setupCalendarPrices(searchCalendar) {
  //To prepend / append
  var li = "<li><div>&nbsp;</div></li>";
  var depart;
  //Reformat depart and return dates
  var newDepartDateStr = "";
  var dateParts = $("#flightDepart").val().split("/");
  //Move all dates format to YMD for comparison only
  switch ($("#flightDepart").attr("data-dateformat")) {
    case "DMY":
      newDepartDateStr = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
      break;
    case "MDY":
      newDepartDateStr = dateParts[2] + "/" + dateParts[0] + "/" + dateParts[1];
      break;
    case "YDM":
      newDepartDateStr = dateParts[0] + "/" + dateParts[2] + "/" + dateParts[1];
      break;
    //In case it's YMD - no need to change
    default:
      newDepartDateStr = $("#flightDepart").val();
  }
  var newReturnDateStr = "";
  dateParts = $("#flightReturn").val().split("/");
  //Move all dates format to YMD for comparison only
  switch ($("#flightReturn").attr("data-dateformat")) {
    case "DMY":
      newReturnDateStr = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
      break;
    case "MDY":
      newReturnDateStr = dateParts[2] + "/" + dateParts[0] + "/" + dateParts[1];
      break;
    case "YDM":
      newReturnDateStr = dateParts[0] + "/" + dateParts[2] + "/" + dateParts[1];
      break;
    //In case it's YMD - no need to change
    default:
      newReturnDateStr = $("#flightReturn").val();
  }
  if (direction === "in") {
    depart = new Date(newDepartDateStr);
  } else depart = Date();
  $(".dateFrame .dateFrame_calendar").each(function (key) {
    try {
      var firstMonth = Number(searchCalendar[key + selectedKey].monthnumber);
      if (--firstMonth == 0) firstMonth = 12;
      $("#dateFrameDepart").attr("data-firstmonth", firstMonth);
      $(this)
        .children()
        .each(function (childKey) {
          var date = new Date(
            $(this).find("a").attr("data-year"),
            $(this).find("a").attr("data-monthnumber") - 1,
            $(this).find("a").attr("data-daynumber")
          );
          if (childKey >= searchCalendar[key + selectedKey].days.length) return;
          if (
            direction === "out" &&
            newDepartDateStr !== "" &&
            new Date(newDepartDateStr).getTime() === date.getTime()
          )
            $(this).find("a").addClass("startDate_selected");
          if (
            direction === "in" &&
            newReturnDateStr !== "" &&
            new Date(newReturnDateStr).getTime() === date.getTime()
          )
            $(this).find("a").addClass("endDate_selected");
          if (
            searchCalendar[key + selectedKey].days[childKey].fare === false ||
            date < depart
          ) {
            $(this).children().find("span").css("visibility", "hidden");
          } else if (
            $("#showCurrencyOnCalendar").val() == "1" &&
            !(
              direction === "out" &&
              calendarPricesOnReturn == "1" &&
              tripType === "RT"
            )
          ) {
            $(this)
              .children()
              .find("span")
              .html(
                $("#rtSymbol").val() +
                " " +
                $(this).children().find("span").html()
              );
          }
          if (
            direction === "in" &&
            calendarPricesOnReturn == "0" &&
            tripType === "RT"
          ) {
            $(this)
              .children()
              .find("span")
              .html("+ " + $(this).children().find("span").html());
          }
          if (
            searchCalendar[key + selectedKey].days[childKey].flight === false &&
            !(
              kiwiDSTByName($("#flightFrom").val()) ||
              kiwiDSTByName($("#flightTo").val())
            )
          ) {
            $(this).find("a").addClass("disabled");
          }
          if (date < depart || date < new Date().setHours(0, 0, 0, 0)) {
            $(this).find("a").addClass("disabled");
          }
        });

      var date = new Date(
        $(this).find("li").first().find("a").attr("data-year"),
        $(this).find("li").first().find("a").attr("data-monthnumber") - 1,
        $(this).find("li").first().find("a").attr("data-daynumber")
      );
      var mondayFirst = $("#companycalendarmonday").val() === "true";
      var dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      var isRTL = $("body").attr("dir") === "rtl";
      var emptyDays = 0;

      if (mondayFirst) {
        emptyDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      } else {
        emptyDays = dayOfWeek;
      }

      for (var j = 0; j < emptyDays; j++) {
        $(this).prepend(li);
      }
      var date = new Date(
        $(this).find("li").last().find("a").attr("data-year"),
        $(this).find("li").last().find("a").attr("data-monthnumber") - 1,
        $(this).find("li").last().find("a").attr("data-daynumber")
      );
      var lastDayOfWeek = date.getDay();
      var paddingDays = 0;

      if (mondayFirst) {
        // Monday first: Sunday (0) should have no padding, other days need padding
        paddingDays = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
      } else {
        // Sunday first: Saturday (6) should have no padding, other days need padding
        paddingDays = lastDayOfWeek === 6 ? 0 : 6 - lastDayOfWeek;
      }

      // RTL: End-of-month padding also needs to be adjusted for RTL layouts
      if (isRTL && paddingDays > 0) {
        // In RTL, the visual layout is reversed, so padding calculation needs adjustment
        if (mondayFirst) {
          // RTL Monday-first: Calculate padding from the visual perspective
          paddingDays = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
        } else {
          // RTL Sunday-first: Calculate padding from the visual perspective
          paddingDays = lastDayOfWeek === 6 ? 0 : 6 - lastDayOfWeek;
        }
      }

      for (var j = 0; j < paddingDays; j++) {
        $(this).append(li);
      }
    } catch (err) {
      logError(err);
      return;
    }
  });
}

function getDSTcodeByName(name, vi) {
  var result = "";
  globalDsts = vi == undefined ? globalDestinations : globalDestinationsVi;
  returnDsts = vi == undefined ? returnDestinations : returnDestinationsVi;

  globalDsts.forEach(function (dst) {
    if ($.trim(dst.name) === $.trim(name)) {
      result = dst.code;
    }
  });
  if (result == "" && returnDsts.length > 0) {
    returnDsts.forEach(function (dst) {
      if ($.trim(dst.name) === $.trim(name)) {
        result = dst.code;
      }
    });
  }
  return result;
}

function kiwiDSTByName(name) {
  var result = false;
  globalDsts = globalDestinations;
  returnDsts = returnDestinations;

  globalDsts.forEach(function (dst) {
    if ($.trim(dst.name) === $.trim(name) && dst.icon) {
      result = true;
    }
  });
  if (result == false && returnDsts.length > 0) {
    returnDsts.forEach(function (dst) {
      if ($.trim(dst.name) === $.trim(name) && dst.icon) {
        result = true;
      }
    });
  }
  return result;
}

$(document).ready(function () {
  $(window).resize(function () {
    if ($("#headerMenuTop").width() > 950) {
      $("#headerMenuTop ul li a").css("font-size", "12px");
    }
    if ($("#headerMenuTop").width() > 850) {
      $("#headerMenuTop ul li a").css("font-size", "13px");
    }
    if ($("#headerMenuTop").width() > 750) {
      $("#headerMenuTop ul li a").css("font-size", "14px");
    }
  });
  if ($("#headerMenuTop").width() > 950) {
    $("#headerMenuTop ul li a").css("font-size", "12px");
  }
  if ($("#headerMenuTop").width() > 850) {
    $("#headerMenuTop ul li a").css("font-size", "13px");
  }
  if ($("#headerMenuTop").width() > 750) {
    $("#headerMenuTop ul li a").css("font-size", "14px");
  }

  if (
    $("#useLocationServices").val() == "true" &&
    $("#flightFrom").length > 0 &&
    $("#flightFrom").val().trim() == ""
  ) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        callController(
          "general",
          "destinations",
          "geoLocation=1&long=" +
          position.coords.longitude +
          "&lat=" +
          position.coords.latitude,
          false,
          false,
          function (response) {
            response = JSON.parse(response);
            if (response.length > 0) {
              if ($("#flightFrom").val().trim() == "") {
                $("#flightFrom").val(response[0]["name"]);
                fromAutoComplete(true);
                updateSelectedDSTcss("flightFrom");
              }
            }
          }
        );
      });
    }
  }
  $("#flightForm_passengers").val(
    Number(
      Number($("#passAdults").val()) +
      Number($("#passChildren").val()) +
      Number(
        $("#passInfants").val() != undefined ? $("#passInfants").val() : 0
      )
    ) +
    " " +
    (Number(
      Number($("#passAdults").val()) +
      Number($("#passChildren").val()) +
      Number(
        $("#passInfants").val() != undefined ? $("#passInfants").val() : 0
      )
    ) != 1
      ? $("#passengerTrans").val()
      : $("#onePassengerTrans").val())
  );
});

//when num of adults on flight-results = 0 it redirects to index with modal
if (window.location.search.indexOf("noAdults") >= 0) {
  selfix = this;
  $("#overlay").attr("aria-hidden", "false");
  $("#noAdults")
    .fadeIn()
    .promise()
    .done(function () {
      $("#overlay").attr("aria-hidden", "false");
      $("#overlay").css("display", "");
    });
}

//When invalid breakdown or redirection - show this error
if (window.location.search.indexOf("requestErr") >= 0) {
  selfix = this;
  $("#overlay").attr("aria-hidden", "false");
  $("#requestErr")
    .fadeIn()
    .promise()
    .done(function () {
      $("#overlay").attr("aria-hidden", "false");
      $("#overlay").css("display", "");
    });
}

$(".switch").on("click", function (e) {
  e.preventDefault();
  degree = getRotationDegrees($(this));
  $(this).animate(
    { borderSpacing: degree + 180 },
    {
      step: function (now, fx) {
        $(this).css("-webkit-transform", "rotate(" + now + "deg)");
        $(this).css("-moz-transform", "rotate(" + now + "deg)");
        $(this).css("transform", "rotate(" + now + "deg)");
      },
      duration: "slow",
    },
    "linear"
  );

  if (globalSightseeing) {
    //Enable element when switching destinations
    $(".flightType select").prop("disabled", false);
  }

  //If we switched to sightseeing destination, Set the correct destination in the return destination
  if (
    globalSightseeingDestination.length > 0 &&
    globalSightseeingDestination[0].trim().toLowerCase() ==
    $("#flightTo").val().trim().toLowerCase()
  ) {
    var a = globalSightseeingDestination[1];
    var b = globalSightseeingDestination[0];
    $("#flightFrom").val(b);
    //Move the button
    updateSelectedDSTcss("flightFrom");
    $("#flightTo").val(a);
    //Move the button
    updateSelectedDSTcss("flightTo");

    if ($(".flightType option:selected").val() != "OW") {
      $(".flightType select option[value='OW']").prop("selected", true);
      $(".flightType select").trigger("change");
    }
    $(".flightType select").prop("disabled", "disabled");
    globalSightseeing = true;
  } else {
    var a = $("#flightFrom").val();
    var b = $("#flightTo").val();
    $("#flightFrom").val(b);
    //Move the button
    updateSelectedDSTcss("flightFrom");
    $("#flightTo").val(a);
    //Move the button
    updateSelectedDSTcss("flightTo");
  }

  if ($("#flightTo").val().trim() == "") {
    //emulate opening the list after changing value in order to load flightTo destination list
    $("#flightFrom").trigger("click");
  }
  fetchDatesOnChange();
});

function getRotationDegrees(obj) {
  var matrix =
    obj.css("-webkit-transform") ||
    obj.css("-moz-transform") ||
    obj.css("-ms-transform") ||
    obj.css("-o-transform") ||
    obj.css("transform");
  if (matrix !== "none") {
    var values = matrix.split("(")[1].split(")")[0].split(",");
    var a = values[0];
    var b = values[1];
    var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
  } else {
    var angle = 0;
  }
  return angle;
}

//close no adults modal
$("#noAdults a.userPop_close, #closenoAdults").on("click", function () {
  window.history.pushState(
    null,
    null,
    window.location.href.replace("?noAdults", "")
  ); //remove the string 'noAdults' from URL
  selfix = this;
  $("#overlay").attr("aria-hidden", "true");
  $("#noAdults")
    .fadeOut()
    .promise()
    .done(function () {
      $(this).attr("aria-hidden", "true");
      $(this).css("display", "");
    });
  return false;
});

$("#requestErr a.userPop_close, #closerequestErr").on("click", function () {
  window.history.pushState(
    null,
    null,
    window.location.href.replace("?requestErr", "")
  ); //remove the string 'noAdults' from URL
  selfix = this;
  $("#overlay").attr("aria-hidden", "true");
  $("#requestErr")
    .fadeOut()
    .promise()
    .done(function () {
      $(this).attr("aria-hidden", "true");
      $(this).css("display", "");
    });
  return false;
});

$(".svgCalendarContainer").on("click", function () {
  $(this).prev().find("input").trigger("focus");
});

// Add Enter key functionality to clear route
$(".clear-button")
  .on("click", function () {
    $(this).next().find("input").val("");
    updateSelectedDSTcss($(this).next().find("input").attr("id"), false);
    $(this).next().find("input").trigger("click");

    if (
      $(this).siblings(".easy-autocomplete").find("#flightFrom").length > 0 &&
      $(".flightType select").is(":disabled")
    ) {
      $(".flightType select").prop("disabled", false);
      globalSightseeing = false;
    }
  })
  .on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();      // stop page scroll / form submit
      $(this).trigger("click");
    }
  });

$(".switch").trigger("click");

$("#flightFrom, #flightTo").on("input", function (e) {
  updateSelectedDSTcss($(this).attr("id"), false);
});

function updateSelectedDSTcss(elementID, closeForEdit) {
  if (
    $("#" + elementID)
      .val()
      .trim() == ""
  ) {
    $("#" + elementID)
      .parent()
      .prev()
      .css("display", "none");
    $("#" + elementID)
      .parent()
      .css("background-color", "");
  } else {
    $("#" + elementID)
      .parent()
      .prev()
      .css("display", "block");
    $("#" + elementID)
      .parent()
      .css("background-color", "#f0f0f0");
  }
  if (typeof closeForEdit == "undefined") return;
  if (closeForEdit && autoDstToField) $("#" + elementID).prop("disabled", true);
  else $("#" + elementID).prop("disabled", false);
}

function isUserFromMobile() {
  var deviceType;
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (
    bIsIpad ||
    bIsIphoneOs ||
    bIsMidp ||
    bIsUc7 ||
    bIsUc ||
    bIsAndroid ||
    bIsCE ||
    bIsWM
  ) {
    return true;
  } else {
    return false;
  }
}

//if we have a VI search- load the relevan js
if ($(".flightFormVI").exists())
  document.writeln(
    "<script type='text/javascript' src='/scripts/bookingProcess/viEngine.js'></script>"
  );

// trigger currency change if client is on the itinerary page(in case of hold my booking) with wrong currency while the fare is limited to a currency
if (window.triggerCurrencyChange && window.targetCurrencyCode) {
  showLoader();
  callController(
    "general",
    "currencyHandler",
    "checkin=0&system=1&currencyToChange=" + window.targetCurrencyCode,
    false,
    false,
    function (res) {
      if (res) {
        hideAeroLoader();
        res = JSON.parse(res);
      } else {
        location.href = location.pathname.replace(
          "/" + $(".headerTop_toggle.headerTop_currency").find("span").text(),
          ""
        );
      }
    }
  );
}
