//Toggle the "Add Contact Details"
$(document).ready(function () {
  $(function () {
    $(".passengersDetails_contactCheckBox").change(function () {
      if (this.checked) {
        $(this)
          .parent()
          .parent()
          .find(".passengersDetails_contactPanel")
          .attr("aria-hidden", "false");
      } else {
        $(this)
          .parent()
          .parent()
          .find(".passengersDetails_contactPanel")
          .attr("aria-hidden", "true");
      }
    });

    //Clear the madatory field red alert upon filling the field.
    $(".passengersDetails_section input").focus(function () {
      if ($(this).attr("id") != "ckbtn") {
        $(this)
          .siblings(".passengersDetails_error")
          .css("visibility", "hidden");
        $(this).css({
          background: "#fff",
          "border-color": "",
        });

        if (
          $(this).siblings(".passengersDetails_error").length == 0 &&
          $(this).parent().hasClass("ffGroup") &&
          $(this).parent().siblings(".passengersDetails_error").length > 0
        ) {
          $(this)
            .parent()
            .siblings(".passengersDetails_error")
            .css("visibility", "hidden");
        }
      }
    });
    //Uniq case, Error div isn't beside the phone input beacuse the wrap
    $(".passengersDetails_section .passengersDetails_phone input").focus(
      function () {
        $(this)
          .parent()
          .siblings(".passengersDetails_error")
          .css("visibility", "hidden");
        $(this).parent().css({
          background: "#fff",
          "border-color": "",
        });
      }
    );

    $(".passengersDetails_combo")
      .find("select")
      .focus(function () {
        if ($(this).css("background-color") != "rgb(255, 255, 255)") {
          $(this)
            .parent()
            .siblings(".passengersDetails_error")
            .css("visibility", "hidden");
          $(this)
            .parent()
            .siblings(".passengersDetails_error")
            .text("Please fill data");
          $(this).css({
            background: "#fff",
            "border-color": "",
          });
        }
      });

    $(document).on(
      "focus",
      "select.special_service_prim, select.special_service",
      function () {
        $(this)
          .parent()
          .siblings(".passengersDetails_SpecialAssistanceError")
          .css("visibility", "hidden");
        $(this).css({
          background: "#fff",
          "border-color": "",
        });
      }
    );

    //If there are error in selection of the date, leave the error in display block
    $(".passengersDetails_date")
      .find("select")
      .focus(function () {
        $(this)
          .parent()
          .parent()
          .parent()
          .find("select")
          .each(function () {
            if ($(this).css("background-color") != "rgb(255, 255, 255)")
              $(this).css({
                background: "#fff",
                "border-color": "",
              });
          });

        $(this)
          .parent()
          .parent()
          .parent()
          .siblings(".passengersDetails_error")
          .css("visibility", "hidden");
        $(this)
          .parent()
          .parent()
          .parent()
          .siblings(".passengersDetails_error")
          .text("Please fill data");
      });

    var phoneFlagsScrollBox = $(
      ".passengersDetails_phoneFrameInner.mCustomScrollbar"
    );
    if (phoneFlagsScrollBox.length > 0) {
      phoneFlagsScrollBox.mCustomScrollbar({
        theme: "dark-3",
        scrollButtons: { enable: true },
      });
    }

    $(".passengersDetails_phoneField ul li a").click(function (e) {
      e.preventDefault();
      var img = $(this).find("img");
      var code = $(this).find("span");
      if (img.length > 0) {
        var src = img.attr("src");
        var phoneext = $(this).attr("phoneext");
        var flag = $(this).attr("data-flag");

        var parent = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent();
        var span = parent.parent().next();
        var input = parent.parent().next().next();
        input.trigger("focus"); //In case there is an error, focus will remove the display block
        span.html(code.text());
        span.attr("phoneext", phoneext);
        span.attr("data-flag", flag);

        var id = parent.attr("id");
        //need to update also the phoneext_x attribute of
        parent.prev().trigger("click");
      }
    });

    //close flag menu, in case of clicking the body (focusout func not working in IOS)
    $("body,select").click(function (e) {
      var target = $(e.target);
      if (
        target.is(".mCSB_dragger_bar") ||
        target.is(".mCustomScrollBox") ||
        target.is(".mCSB_draggerRail") ||
        target.is(".passengersDetails_autocompleteCountries") ||
        target.is(".passengersDetails_phonePop") ||
        target.is(".autocompleteCountries")
      )
        return false;

      var elements = $(".phoneExt_toggle");
      $(elements).each(function (index, el) {
        if ($(el).attr("aria-expanded") === "true") $(el).trigger("click");
      });
    });

    if ($("#registerPop").length > 0 && $("#dobDaySelect option").length === 0) {
      // Add dynamic day updates based on month/year selection
      signUpSetDate();
    }
  });

  // setup dynamic date dropdowns
  function signUpSetDate() {
    const monthSelect = $("#dobMonthSelect");
    const yearSelect = $("#dobYearSelect");
    const daySelect = $("#dobDaySelect");

    // Function to update days based on selected month and year
    function updateDays() {
      const selectedMonth = parseInt(monthSelect.val());
      const selectedYear = parseInt(yearSelect.val());

      if (!selectedMonth || !selectedYear) {
        return; // Don't update if month or year not selected
      }

      // Get currently selected day
      const currentlySelectedDay = parseInt(daySelect.val());

      // Get number of days in the selected month
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

      // Clear existing day options except the first one
      daySelect.find("option:not(:first)").remove();

      // Add new day options
      for (let i = 1; i <= daysInMonth; i++) {
        daySelect.append(`<option value="${i}">${i}</option>`);
      }

      // Restore the selected day if it's still valid for this month
      if (currentlySelectedDay && currentlySelectedDay <= daysInMonth) {
        daySelect.val(currentlySelectedDay);
      }
    }


    // Function to initialize dropdowns with months and years
    function initializeDropdowns() {
      try {
        var day = document.getElementById('dobDaySelect');
        var month = document.getElementById('dobMonthSelect');
        var year = document.getElementById('dobYearSelect');

        if (!day || !month || !year) {
          return;
        }

        //monthsArray id contains all the value + monthDisplay of monthes, such "value" is the month serial number, and "monthDisplay" is the month name
        var monthList = JSON.parse($("#monthsArray").val());

        /* Creating Year list from current year down to 1900 */
        var yearList = new Date();
        var globalYear = yearList.getFullYear();
        var yearArr = [];
        for (i = globalYear; i >= 1900; i--) {
          yearArr.push({ "year": i, "yearid": i });
        }

        // Generate initial days for January (month 1) of year 1900
        var initialYear = 1900;
        var initialMonth = 1;
        var daysInMonth = new Date(initialYear, initialMonth, 0).getDate();
        var dayArr = [];
        for (i = 1; i <= daysInMonth; i++) {
          var dayNumberStr = i < 10 ? '0' + i : String(i);
          dayArr.push({ "daynumber": dayNumberStr });
        }

        // Clear existing options to prevent duplication
        if (day) day.options.length = 0;
        if (month) month.options.length = 0;
        if (year) year.options.length = 0;

        // Populate dropdowns
        injectDropDown(dayArr, 'daynumber', 'daynumber', day, false, 0);
        injectDropDown(monthList, 'value', 'monthDisplay', month, false, 0);
        injectDropDown(yearArr, 'year', 'yearid', year, false, 0);
      } catch (err) {
        logError('Error initializing date dropdowns:', err);
      }
    }

    // Initialize dropdowns
    initializeDropdowns();

    // Add event listeners for month and year changes
    monthSelect.on("change", updateDays);
    yearSelect.on("change", updateDays);
  }
});
