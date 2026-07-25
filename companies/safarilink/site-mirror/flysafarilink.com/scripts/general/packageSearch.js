var packageDSTS = [];

function searchPkg() {
  var fullCalendar;
  var dates = { y: 0, m: 0 };
  var dates2 = { y: 0, m: 0 };
  var monthCalendarPkg = cloneElement("dateFrame_month_pkg", 0);
  var monthCalendarPkg2 = cloneElement("dateFrame_month_pkg2", 0);
  var dayli = $(".dayLi");
  var availableDays;
  if ($(".pkgEngine").length > 0) {
    /* style */
    //set default value
    $(".pkgEngine .selectfiled input").val(
      $(".pkgEngine .selectfiled li div").first().html()
    );
    $(".pkgEngine .selectfiled input").attr("data-style-val", 0);
    $(".pkgEngine .selectfiled label[for=style]").addClass("filled");

    //close all other popups when style input on focus
    $(".pkgEngine .selectfiled input").on("focus", function () {
      closeDates_pkg();
      closeDays();
      $(this)
        .siblings(".stylesHolder")
        .find("ul")
        .slideDown()
        .promise()
        .done(function () {
          $(this).css("display", "block");
        });
    });

    $(".pkgEngine .selectfiled .stylesHolder ul li").on("click", function (e) {
      e.preventDefault();
      $(this)
        .parents(".stylesHolder")
        .siblings("input")
        .val($(this).find("div").html());
      $(this)
        .parents(".stylesHolder")
        .siblings("input")
        .attr("data-style-val", $(this).find("div").attr("data-style-val"));
      closeStyle();

      var styleid = $(this).find("div").attr("data-style-val");
      callController(
        "packages",
        "pkgEngineData",
        "?action=destinationsFilter&styleid=" + styleid.toString(),
        false,
        false,
        function (destinations) {
          destinations = JSON.parse(destinations);
          packageDSTS = destinations;
          fromAutoCompletePkg(destinations);
        }
      );
      callDaysController();
    });

    $(".pkgEngine .selectfiled .stylesHolder ul li").hover(function () {
      $(this).parent().find(".selected").removeClass("selected");
      $(this).addClass("selected");
    });

    function closeStyle() {
      if ($(".pkgEngine .stylesHolder").find("ul").css("display") == "none")
        return;
      $(".pkgEngine .stylesHolder")
        .find("ul")
        .slideUp()
        .promise()
        .done(function () {
          $(this).css("display", "none");
        });
    }

    /* destinations */
    callController(
      "packages",
      "pkgEngineData",
      "?action=destinations",
      false,
      false,
      function (destinations) {
        destinations = JSON.parse(destinations);
        packageDSTS = destinations;
        fromAutoCompletePkg(destinations);
      }
    );

    function fromAutoCompletePkg(destinations) {
      $("#flightFromPkg").val("");
      $(".pkgEngine .pkgDestinations label[for=flightFromPkg]").removeClass(
        "filled"
      );
      var self = $("#flightFromPkg");
      self.on("focus", function () {
        $(this).parents("label").addClass("focused");
        closeDates_pkg();
        closeStyle();
        closeDays();
        var e = jQuery.Event("keyup");
        e.which = 0; //choose the one you want
        e.keyCode = 0;
        var value = $(this).val() !== "" ? $(this).val() : "";
        $(this).val(value).trigger(e);
        $(this).parents("label").addClass("focused");
      });
      self.easyAutocomplete({
        data: destinations,
        getValue: "name",
        list: {
          maxNumberOfElements: 100,
          onShowListEvent: function () {
            self.parents("label").addClass("focused");
          },
          onHideListEvent: function () {
            if (self.val() != "") self.parents("label").addClass("filled");
          },
          match: { enabled: true },
        },
      });
    }

    $(".flightForm li label input").on("change", function () {
      if ($(this).val() == " ") {
        $(this).val("");
      }
    });

    $(".pkgDestinations input").on("change", function () {
      callDaysController();
    });

    /* days */
    $("#flightForm_daysNumber_pkg").on("focus", function () {
      closeDates_pkg();
      closeStyle();

      $(this)
        .siblings(".daysHolder")
        .find("ul")
        .slideDown()
        .promise()
        .done(function () {
          $(this).css("display", "block");
        });
    });

    callController(
      "packages",
      "pkgEngineData",
      "?action=days",
      false,
      false,
      function (days) {
        var days = JSON.parse(days);
        insertDaysOptions(days);
      }
    );

    function insertDaysOptions(days) {
      $(".dayLiHolder").empty();
      dayli.appendTo(".dayLiHolder");
      $("#flightForm_daysNumber_pkg").val(dayli.find(".daysNumber").html());
      days.forEach(function (element) {
        var clone = dayli.clone();
        clone.find(".daysNumber").html(element);
        clone.find(".eac-item").attr("data-day-val", element);
        clone.find(".daysText").css("display", "inline-block");
        clone.appendTo(".dayLiHolder");
      });
      $(".pkgEngine .daysHolder .dayLiHolder li").on("click", function (e) {
        e.preventDefault();
        $(this)
          .parents(".daysHolder")
          .siblings("input")
          .attr("data-day-val", $(this).find(".eac-item").attr("data-day-val"));
        var thisValue =
          parseInt($(this).find(".daysNumber").html()) == 0
            ? dayli.val()
            : $(this).find(".daysNumber").html();
        $(this).parents(".daysHolder").siblings("input").val(thisValue);
        closeDays();
      });
    }

    function closeDays() {
      $(".dayLiHolder")
        .slideUp()
        .promise()
        .done(function () {
          $(this).css("display", "none");
        });
    }

    function callDaysController() {
      var styleid = $(".pkgEngine .selectfiled input").attr("data-style-val");
      var dstid =
        getDSTcodeByNameForPKG($("#flightFromPkg").val()) == ""
          ? 0
          : getDSTcodeByNameForPKG($("#flightFromPkg").val());

      callController(
        "packages",
        "pkgEngineData",
        "?action=daysFilter&styleid=" + styleid + "&dstid=" + dstid,
        false,
        false,
        function (days) {
          var days = JSON.parse(days);
          insertDaysOptions(days);
        }
      );
    }

    /* dates */
    //open calendar popup
    $(document).on("focus", "#flightDepart_pkg", function () {
      closeStyle();
      closeDays();
      $("#flightForm_datePop_pkg")
        .slideDown()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "false");
        });
    });

    $(document).on("focus", "#flightDepart_pkg2", function () {
      $("#flightForm_datePop_pkg2")
        .slideDown()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "false");
          $(this).parent(".flightForm_dateHolder").css("position", "relative");
        });
    });

    //close calendar popup
    function closeDates_pkg() {
      $("#flightForm_datePop_pkg")
        .slideUp()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "true");
        });
      $("#flightForm_datePop_pkg2")
        .slideUp()
        .promise()
        .done(function () {
          $(this).attr("aria-hidden", "true");
        });
    }

    //close calendar X button
    $(".flightForm_dateClose_pkg").on("click", function (e) {
      e.preventDefault();
      closeDates_pkg();
    });

    addLoader(document.getElementById("dateFrame_pkg"), false);
    if ($("#flightForm_datePop_pkg2").length > 0)
      addLoader(document.getElementById("dateFrame_pkg2"), false);

    //get calendar data from controller
    callController(
      "packages",
      "packageBookCalendar",
      false,
      "",
      false,
      function (data) {
        calendarData = JSON.parse(copyObj(data));
        fullCalendar = calendarData.calendar;
        availableDays = calendarData.days;
        var nextThreeDays = new Date().addDays(3);
        var startDate = new Date();
        if (nextThreeDays.getMonth() > new Date().getMonth())
          startDate.setMonth(startDate.getMonth() + 1);
        if ($("#flightForm_datePop_pkg").length > 0) {
          dates.y = startDate.getFullYear();
          dates.m = startDate.getMonth();
          document.getElementById("dateFrame_pkg").innerHTML = "";
          getCalendar(fullCalendar, dates, "dateFrame_pkg");
        }
        if ($("#flightForm_datePop_pkg2").length > 0) {
          dates2.y = startDate.getFullYear();
          dates2.m = startDate.getMonth();
          document.getElementById("dateFrame_pkg2").innerHTML = "";
          getCalendar(fullCalendar, dates2, "dateFrame_pkg2");
        }
      }
    );

    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    //next month
    $(document).on(
      "click",
      "#flightForm_datePop_pkg .flightForm_dateNextMonth, #flightForm_datePop_pkg2 .flightForm_dateNextMonth",
      function (e) {
        e.preventDefault();
        $(this).siblings(".flightForm_datePrevMonth").removeClass("disabled");
        $(this)
          .siblings(".flightForm_datePrevMonth")
          .css("pointer-events", "auto");
        var localDates;
        if ($(this).parents("#flightForm_datePop_pkg").length > 0) {
          localDates = dates;
          $("#dateFrame_pkg").empty();
        } else {
          localDates = dates2;
          $("#dateFrame_pkg2").empty();
        }
        if (localDates.m > 11) {
          localDates.m = 0;
          localDates.y += 1;
        }
        dateFrame = $(this).siblings(".frameid").attr("id");
        getCalendar(fullCalendar, localDates, dateFrame);
      }
    );

    //previous month
    $(document).on(
      "click",
      "#flightForm_datePop_pkg .flightForm_datePrevMonth, #flightForm_datePop_pkg2 .flightForm_datePrevMonth",
      function (e) {
        e.preventDefault();
        var localDates;
        if ($(this).parents("#flightForm_datePop_pkg").length > 0) {
          localDates = dates;
          $("#dateFrame_pkg").empty();
        } else {
          localDates = dates2;
          $("#dateFrame_pkg2").empty();
        }
        localDates.m -= 2;
        if (localDates.m < 0) {
          localDates.m = localDates.m == -1 ? 11 : 10;
          localDates.y -= 1;
        }
        if (localDates.m == new Date().getMonth()) {
          $(this).addClass("disabled");
          $(this).css("pointer-events", "none");
        }
        dateFrame = $(this).siblings(".frameid").attr("id");
        getCalendar(fullCalendar, localDates, dateFrame);
      }
    );

    //choose a date
    $(document).on(
      "click",
      "#flightForm_datePop_pkg .dateFrame_calendar_pkg a, #flightForm_datePop_pkg2 .dateFrame_calendar_pkg2 a",
      function (e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
          return false;
        }
        $(".bookForm .dateInputPkg").css("background", "white");
        showAeroLoader();
        var dayx = $(this).find("strong").html();
        if (dayx.length < 2) dayx = "0" + dayx;
        var monthx = $(this).data().monthnumber;
        var yearx = $(this).data().year;
        var fromDate;
        var toDate;

        //$(this).closest('.flightForm_datePop').find('.flightForm_datePrevMonth').addClass('disabled');
        $(this)
          .parents(".monthPkg")
          .parent()
          .find("a")
          .removeClass("pkg_selected");
        $(this).addClass("pkg_selected");
        var format = $(this)
          .closest(".flightForm_dateHolder")
          .siblings(".pkgEngine")
          .find(".dateInputPkg")
          .attr("data-dateformat");
        format = format !== "" ? format : "DMY";
        datesInput = $(this)
          .closest(".flightForm_dateHolder")
          .siblings(".pkgEngine")
          .find(".dateInputPkg");
        switch (format) {
          case "YMD":
            $(datesInput).val(yearx + "/" + monthx + "/" + dayx);
            //$("#flightDepart_mobile").val(yearx+'/'+monthx+'/'+dayx);
            break;
          case "MDY":
            $(datesInput).val(monthx + "/" + dayx + "/" + yearx);
            //$("#flightDepart_mobile").val(monthx+'/'+dayx+'/'+yearx);
            break;

          default: //DMY
            $(datesInput).val(dayx + "/" + monthx + "/" + yearx);
            //$("#flightDepart_mobile").val(dayx+'/'+monthx+'/'+yearx);
            break;
        }
        $(datesInput)
          .parents("label")
          .removeClass("focused")
          .addClass("filled");
        $(datesInput).attr("data-date-ymd", yearx + "/" + monthx + "/" + dayx);
        $(datesInput).siblings(".removeDateChoice_pkg").css("display", "block");
        closeDates_pkg();
        hideAeroLoader();
      }
    );

    $(".removeDateChoice_pkg").on("click", function (e) {
      e.preventDefault();
      $(this).siblings(".dateInputPkg").val("");
      $(this).siblings(".dateInputPkg").attr("data-date-ymd", "");
      $(this)
        .siblings(".dateInputPkg")
        .parents("label")
        .removeClass("filled")
        .removeClass("focused");
      $(this).css("display", "none");
      $(this)
        .closest(".pkgEngine")
        .siblings(".flightForm_dateHolder")
        .find("a")
        .removeClass("pkg_selected");
    });

    /* book adults,kids,infant */
    if ($(".bookForm").length > 0) {
      $(document).on("change", ".bookForm select", function () {
        if ($(this).val() != "") {
          $(this).parents("label").removeClass("focused").addClass("filled");
        } else $(this).parents("label").removeClass("focused").removeClass("filled");
      });
    }

    /* button */
    $(document).on("click", '#pkgSubmit input[type="submit"]', function () {
      var styleid =
        $("#style").attr("data-style-val") == ""
          ? 0
          : $("#style").attr("data-style-val");
      var dstid =
        getDSTcodeByNameForPKG($("#flightFromPkg").val()) == ""
          ? 0
          : getDSTcodeByNameForPKG($("#flightFromPkg").val());
      var departdate =
        $("#flightDepart_pkg").val() == ""
          ? null
          : $("#flightDepart_pkg").val();
      var numberofdays = parseInt(
        $("#flightForm_daysNumber_pkg").attr("data-day-val")
      );

      if (departdate != null) {
        var date = departdate.split("/");
        departdate = [date[2], date[1], date[0]].join("-");
      }
      showLoader();
      window.top.location.href =
        $("#homeUrl").val() +
        "/packages/" +
        styleid +
        "/" +
        dstid +
        "/" +
        numberofdays +
        "/" +
        departdate;
    });
  }

  function translateMonth(calendar) {
    var monthList = JSON.parse($("#monthsArray").val());
    var currentMonth = $(calendar)
      .find(".dateFrame_title")
      .text()
      .trim()
      .split(" ")[0];
    switch (currentMonth) {
      case "JANUARY":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("JANUARY", monthList[0]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "FEBRUARY":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("FEBRUARY", monthList[1]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "MARCH":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("MARCH", monthList[2]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "APRIL":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("APRIL", monthList[3]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "MAY":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("MAY", monthList[4]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "JUNE":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("JUNE", monthList[5]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "JULY":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("JULY", monthList[6]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "AUGUST":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("AUGUST", monthList[7]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "SEPTEMBER":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("SEPTEMBER", monthList[8]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "OCTOBER":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("OCTOBER", monthList[9]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "NOVEMBER":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("NOVEMBER", monthList[10]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      case "DECEMBER":
        newText = $(calendar)
          .find(".dateFrame_title")
          .text()
          .replace("DECEMBER", monthList[11]["monthDisplayFull"]);
        $(calendar).find(".dateFrame_title").text(newText);
        break;
      default:
    }
  }

  //check if a day is in on the pricing range of the package and if this pricing is available for this day of the week
  function validDay(date, clendarElementId) {
    if (availableDays == undefined || clendarElementId == "dateFrame_pkg")
      return true;

    flag = false;

    availableDays.forEach(function (days) {
      start = new Date(days.fromdate);
      end = new Date(days.todate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      //if day is in pricing range
      if (
        date.getTime() <= end.getTime() &&
        date.getTime() >= start.getTime()
      ) {
        //and if its available on this day of the week
        if (days["day" + (date.getDay() + 1).toString()]) flag = true;
      }
    });

    return flag;
  }

  function getCalendar(calendardata, yearMonth, dateFarmeId) {
    var monthBox =
      dateFarmeId == "dateFrame_pkg" ? monthCalendarPkg : monthCalendarPkg2;
    var datesClass =
      dateFarmeId == "dateFrame_pkg"
        ? "dateFrame_calendar_pkg"
        : "dateFrame_calendar_pkg2";
    var calendar = injectHTML(
      calendardata[yearMonth.y.toString()]["months"][yearMonth.m],
      monthBox,
      dateFarmeId,
      Number(0)
    );
    translateMonth(calendar);
    var children = injectChildren(
      calendardata[yearMonth.y.toString()]["months"][yearMonth.m].days,
      calendar,
      datesClass,
      dateFarmeId,
      Number(0),
      true
    );

    $(children)
      .find("a")
      .each(function (key) {
        var date = new Date(
          $(this).attr("data-year"),
          $(this).attr("data-monthnumber") - 1,
          parseInt($(this).attr("data-daynumber"))
        );
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        today = today.addDays(3);
        if (date < today || !validDay(date, dateFarmeId))
          $(this).addClass("disabled");
      });

    yearMonth.m++;
    if (yearMonth.m > 11) {
      yearMonth.m = 0;
      yearMonth.y++;
    }
    var calendar = injectHTML(
      calendardata[yearMonth.y.toString()]["months"][yearMonth.m],
      monthBox,
      dateFarmeId,
      0
    );
    translateMonth(calendar);
    var nextMonthChildren = injectChildren(
      calendardata[yearMonth.y.toString()]["months"][yearMonth.m].days,
      calendar,
      datesClass,
      dateFarmeId,
      Number(1),
      true
    );

    $(nextMonthChildren)
      .find("a")
      .each(function (key) {
        var date = new Date(
          $(this).attr("data-year"),
          $(this).attr("data-monthnumber") - 1,
          parseInt($(this).attr("data-daynumber"))
        );
        if (!validDay(date, dateFarmeId)) $(this).addClass("disabled");
      });

    var li = "<li><div>&nbsp;</div></li>";
    $("#" + dateFarmeId + " ." + datesClass).each(function (key) {
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
        // Monday first: adjust Sunday (0) to be 7, then subtract 1
        emptyDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      } else {
        // Sunday first: use dayOfWeek directly
        emptyDays = dayOfWeek;
      }

      // RTL: In RTL layouts, the CSS visually reverses the grid columns
      // The DOM structure remains the same, but visual position is flipped
      if (isRTL) {
        // In RTL, we need to think about where the day should appear visually,
        // then calculate the DOM position that will result in that visual position
        var visualPosition;

        if (mondayFirst) {
          // Monday-first: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
          visualPosition = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        } else {
          // Sunday-first: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
          visualPosition = dayOfWeek;
        }

        // In RTL CSS, visual position 0 (leftmost) corresponds to DOM position 6
        // Visual position 1 corresponds to DOM position 5, etc.
        emptyDays = 6 - visualPosition;
      }

      for (var j = 0; j < emptyDays; j++) {
        $(this).prepend(li);
      }

      var date = new Date(
        $(this).find("li").last().find("a").attr("data-year"),
        $(this).find("li").last().find("a").attr("data-monthnumber") - 1,
        $(this).find("li").last().find("a").attr("data-daynumber")
      );

      // Consistent end-of-month padding
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
    });
  }
}

function getDSTcodeByNameForPKG(name) {
  var result = "";
  packageDSTS.forEach(function (dst) {
    if ($.trim(dst.name) === $.trim(name)) {
      result = dst.code;
    }
  });
  return result;
}

$(document).ready(function () {
  if ($(".dateFrame_month_pkg")) {
    searchPkg();
  }
});
