/*Created By Nikolas Magno - https://github.com/nikolasmagno/jquery-weekdays*/
$(function ($) {
  $.fn.weekdays = function (options) {
    options = consolideOptions(options);

    var $this = $(this);
    var $html = $("<ul class=" + options.listClass + ">");

    $this.data({
      days: options.days,
      selectedIndexes: options.selectedIndexes
    });

    $($this.data().days).each(function (index, item) {
      var selected = $this.data().selectedIndexes.includes(index);
      var $liElement = $("<li data-day=" + index + " class=" + options.itemClass + " selected=" + selected + ">" + item + "</li>");

      $liElement.on('click', function (item) {
        if (options.singleSelect)
          singleSelectMode(options, $html);

        var $li = $(item.target);
        toggleSelection($li, options);
      });

      if (selected)
        $liElement.toggleClass(options.itemSelectedClass);

      $liElement.prop('selected', selected);

      $html.append($liElement);
    });

    $this.append($html);
  };

  $.fn.weekdays.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  $.fn.selectedIndexes = function () {
    return $(this).find('li')
      .filter(function (index, a) {
        return a.selected;
      })
      .map(function (index, item) {
        return $(item).attr("data-day");
      });
  };

  $.fn.selectedDays = function () {
    var $this = $(this);

    return $(this).find('li')
      .filter(function (index, a) {
        return a.selected;
      })
      .map(function (index, item) {
        return $this.data().days[$(item).attr("data-day")];
      });
  };

  function consolideOptions(options) {
    options = options ? options : {};
    options.days = options.days ? options.days : $.fn.weekdays.days;
    options.selectedIndexes = options.selectedIndexes ? options.selectedIndexes : [];
    options.listClass = options.listClass ? options.listClass : 'weekdays-list';
    options.itemClass = options.itemClass ? options.itemClass : 'weekdays-day';
    options.itemSelectedClass = options.itemSelectedClass ? options.itemSelectedClass : 'weekday-selected';
    options.singleSelect = options.singleSelect ? options.singleSelect : false;

    return options;
  }

  function singleSelectMode(options, $html) {
    $html.find('li')
      .each(function (index, item) {
        var $li = $(item);

        $li.prop('selected', false);
        $li.removeClass(options.itemSelectedClass);
      });
  }

  function toggleSelection($li, options) {
    var selected = !$li.prop('selected')

    $li.prop('selected', selected);
    $li.toggleClass(options.itemSelectedClass);
    initialized = true;
    startCldnr();
  }
});

// function initCalen() {
$(function () {
  $('#weekdays').weekdays({
    days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  });
});
// }

function getLocaleDay(days) {
  let res = [];

  for (let i = 0; i < days.length; i++) {
    switch (days[i]) {
      case "Domingo":
        res.push('Sun');
        break;
      case 'Lunes':
        res.push('Mon');
        break;
      case 'Martes':
        res.push('Tue');
        break;
      case 'Miércoles':
        res.push('Wed');
        break;
      case 'Jueves':
        res.push('Thu');
        break;
      case 'Viernes':
        res.push('Fri');
        break;
      case 'Sábado':
        res.push('Sat');
        break;
    }
  }

  return res;
}

// Call this from the developer console and you can control both instances
var calendars = {};
var availableDays = [];
let initialized = false;

function getWeekdaysInMonth(month, year) {
  var days = daysInMonth(month, year);
  var weekdays = 0;
  availableDays = [];

  for (var i = 0; i < days; i++) {
    if (isWeekday(year, month, i + 1)) {
      weekdays++;
      availableDays.push(new Date(year, month, i + 1));
    }
  }

  return availableDays;
}

function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

function isWeekday(year, month, day) {
  var day = new Date(year, month, day).getDay();
  return day != 0 && day != 6;
}

var actualDate = new Date();
var weekdays = getWeekdaysInMonth(actualDate.getMonth(), actualDate.getFullYear());
let daysOff = [];

function init() {
  $(document).ready(function () {
    // Assuming you've got the appropriate language files,
    // clndr will respect whatever moment's language is set to.
    // moment.locale('ru');

    // Here's some magic to make sure the dates are happening this month.
    var thisMonth = moment().format('YYYY-MM');
    // Events to load into calendar
    var eventArray = [{
      title: 'Multi-Day Event',
      endDate: thisMonth + '-14',
      startDate: thisMonth + '-10'
    }, {
      endDate: thisMonth + '-23',
      startDate: thisMonth + '-21',
      title: 'Another Multi-Day Event'
    }, {
      date: thisMonth + '-27',
      title: 'Single Day Event'
    }];

    // The order of the click handlers is predictable. Direct click action
    // callbacks come first: click, nextMonth, previousMonth, nextYear,
    // previousYear, nextInterval, previousInterval, or today. Then
    // onMonthChange (if the month changed), inIntervalChange if the interval
    // has changed, and finally onYearChange (if the year changed).
    calendars.clndr1 = $('.cal1').clndr({
      // uevents: eventArray,
      clickEvents: {
        click: function (target) {
          console.log('Cal-1 clicked: ', target);
          $(target.element).toggleClass('day-off');

          if ($(target.element).hasClass('day-off')) {
            daysOff.push(target.date._i);
          } else {
            daysOff.pop(target.date._i);
          }

          startCldnr();
        },
        today: function () {
          console.log('Cal-1 today');
        },
        nextMonth: function () {
          console.log('Cal-1 next month');
          initialized = true;
          startCldnr('next');
          // init();
        },
        previousMonth: function () {
          initialized = true;
          console.log('Cal-1 previous month');
          startCldnr('prev');
          // init();
        },
        onMonthChange: function () {
          console.log('Cal-1 month changed');
        },
        nextYear: function () {
          console.log('Cal-1 next year');
        },
        previousYear: function () {
          console.log('Cal-1 previous year');
        },
        onYearChange: function () {
          console.log('Cal-1 year changed');
        },
        nextInterval: function () {
          console.log('Cal-1 next interval');
        },
        previousInterval: function () {
          console.log('Cal-1 previous interval');
        },
        onIntervalChange: function () {
          console.log('Cal-1 interval changed');
        }
      },
      multiDayEvents: {
        singleDay: 'date',
        endDate: 'endDate',
        startDate: 'startDate'
      },
      showAdjacentMonths: true,
      adjacentDaysChangeMonth: false,
      ready: startCldnr
    });

    // Bind all clndrs to the left and right arrow keys
    $(document).keydown(function (e) {
      // Left arrow
      if (e.keyCode == 37) {
        calendars.clndr1.back();
      }

      // Right arrow
      if (e.keyCode == 39) {
        calendars.clndr1.forward();
      }
    });
  });
}

var selectedDays = '';

function startCldnr(action) {
  selectedDays = getLocaleDay($('#weekdays').selectedDays());
  let weekdaysSelected = '';
  let daysCount = 0;
  let currDayName = '';
  let date = '';

  if (action == "") {
    $('.clndr-table').find('tbody').find('.calendar-day-' + date).removeClass('res-good');
  }

  if (action == 'prev') {
    weekdaysSelected = getWeekdaysInMonth(actualDate.getMonth(), actualDate.getFullYear());
    clearMonthsDays(weekdaysSelected);
    weekdays = getWeekdaysInMonth(actualDate.getMonth() - 1, actualDate.getFullYear());
    actualDate = new Date(actualDate.setMonth(actualDate.getMonth() - 1));

  }
  else if (action == 'next') {
    weekdaysSelected = getWeekdaysInMonth(actualDate.getMonth(), actualDate.getFullYear());
    clearMonthsDays(weekdaysSelected);
    weekdays = getWeekdaysInMonth(actualDate.getMonth() + 1, actualDate.getFullYear());
    actualDate = new Date(actualDate.setMonth(actualDate.getMonth() + 1));
  }

  for (let i = 0; i < availableDays.length; i++) {
    currDayName = availableDays[i].toString().split(' ')[0];
    date = availableDays[i].toISOString().slice(0, 10);
    $('.clndr-table').find('tbody').find('.calendar-day-' + date).removeClass('res-good');

    if (selectedDays.some(r => currDayName.includes(r))) {
      daysCount++;

      if (daysCount - daysOff.length <= 13) {
        $('.clndr-table').find('tbody').find('.calendar-day-' + date).addClass('res-good');
      } else {
        $('.clndr-table').find('tbody').find('.calendar-day-' + date).addClass('res-good-sobran');
      }
    }
  }

  if (initialized && (daysCount - daysOff.length) && checkIfDayOfIsInSelectedDays(selectedDays) < 13) {
    $('#res').removeClass('res-good');
    $('#res').addClass('res-bad').text('No llegas a los días querido/a');
    $('#daysMissing').empty();
    $('#daysMissing').append('Te faltan: ' + '<label class="cBold">' + daysMissing(daysCount - daysOff.length) + '</label>' + ' días');
  } else if (initialized) {
    $('#daysMissing').empty();
    $('#res').removeClass('res-bad');
    $('#res').addClass('res-good').text('Tranqui los pibes');
  }

  init();
}

function clearMonthsDays(weekdaysSelected) {
  let date = '';
  availableDays = [];

  for (let i = 0; i < weekdaysSelected.length; i++) {
    date = weekdaysSelected[i].toISOString().slice(0, 10);
    $('.clndr-table').find('tbody').find('.calendar-day-' + date).removeClass('res-good');
  }
}

function daysMissing(daysCount) {
  return 13 - daysCount;
}

function checkIfDayOfIsInSelectedDays(selectedDays) {
  if (daysOff.some(r => selectedDays.includes(r))) {
    availableDays[r].splice(r, 1); 
  }
}

init();
