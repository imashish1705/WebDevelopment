$(function() {
  
  // initialize the clock and display
  var clock = new Clock();
  clock.displayCurrentTime();
  clock.displaySessionTime();
  clock.displayBreakTime();
  clock.displaySessionCount();
  
  // add event listeners 
  $(".time-session .minus").click(function() {
    clock.changeSessionTime("subtract");
  });
  $(".time-session .plus").click(function() {
    clock.changeSessionTime("add");
  });
  $(".time-break .minus").click(function() {
    clock.changeBreakTime("subtract");
  });
  $(".time-break .plus").click(function() {
    clock.changeBreakTime("add");
  });
  $(".time-start").click(function() {
    clock.toggleClock();
  });
  $(".time-reset").click(function() {
    clock.reset();
  });
  
  
  // Clock contains all the properties and methods to run a pomodoro clock
  function Clock() {
    
    var _this = this, // needed to pass 'this' to setInterval
        timer, // reference to the interval
        active = false, // is the timer running?
        type = "Session", // type -- "Session" or "Break"
        startTime = 1500, // stores the starting value of timer
        currentTime = 1500, // current time on the clock in seconds
        sessionTime = 1500, // stores the session time in seconds
        breakTime = 300, // stores the break time in seconds
        sessionCount = 0, // stores the number of session that have passed
        startAudio = new Audio("https://media.jpkarlsven.com/audio/codepen/pomodoro-clock/start.mp3"),
        endAudio = new Audio("https://media.jpkarlsven.com/audio/codepen/pomodoro-clock/stop.mp3");
    
    // formatTime returns a friendly formatted time string
    function formatTime(secs) {
      var result = "";
      var seconds = secs % 60;
      var minutes = parseInt(secs / 60) % 60;
      var hours = parseInt(secs / 3600);
      function addLeadingZeroes(time) {
        return time < 10 ? "0" + time : time;
      }
      if (hours > 0) result += (hours + ":");
      result += (addLeadingZeroes(minutes) + ":" + addLeadingZeroes(seconds));
      return result;
    }
    
    // method to add/substract 60 seconds from session time
    // only works if timer is not active
    this.changeSessionTime = function(str) {
      if (active === false) {
        this.reset();
        if (str === "add") {
          sessionTime += 60;
        } else if ( sessionTime > 60){
          sessionTime -= 60;
        }
        currentTime = sessionTime;
        startTime = sessionTime;
        this.displaySessionTime();
        this.displayCurrentTime();
      }
    }
    
    // method to add/subtract 60 seconds from break time
    // only works if timer is not active
    this.changeBreakTime = function(str) {
      if (active === false) {
        this.reset();
        if (str === "add") {
          breakTime += 60;
        } else if (breakTime > 60) {
          breakTime -= 60;
        }
        this.displayBreakTime();
      }
    }
    
    // inserts the current time variable into the DOM
    this.displayCurrentTime = function() {
      $('.main-display').text(formatTime(currentTime));
      if (type === "Session" && $('.progress-radial').hasClass('break')) {
        $('.progress-radial').removeClass('break').addClass('session');
      } else if (type === "Break" && $('.progress-radial').hasClass('session')) {
        $('.progress-radial').removeClass('session').addClass('break');
      }
      $('.progress-radial').attr('class', function(i, c) {
        return c.replace(/(^|\s)step-\S+/g, " step-" + (100 - parseInt((currentTime / startTime) * 100)));
      });
    }
    
    // inserts the session time variable into the DOM
    this.displaySessionTime = function() {
      $('.time-session .time-session-display').text(parseInt(sessionTime / 60) + " min");
    }
    
    // inserts the break time variable into the DOM
    this.displayBreakTime = function() {
      $('.time-break .time-break-display').text(parseInt(breakTime / 60) + " min");
    }
    
    // inserts the session count variable into the DOM
    this.displaySessionCount = function() {
      if (sessionCount === 0) {
        $('.session-count').html("<h2>Pomodoro Clock</h2>");
      } else if (type === "Session") {
        $('.session-count').html("<h2> Session " + sessionCount + "</h2>"); 
      } else if (type === "Break") {
        $('.session-count').html("<h2>Break!</h2>");
      }
    }
    
    // toggles the timer start/pause
    this.toggleClock = function() {
      if (active === true) {
        clearInterval(timer);
        $('.time-start').text('Start');
        active = false;
      } else {
        $('.time-start').text('Pause');
        if (sessionCount === 0) {
          sessionCount = 1;
          this.displaySessionCount();
          startAudio.play();
        }
        timer = setInterval(function() {
          _this.stepDown();
        }, 1000);
        active = true;
      }
    }
    
    // steps the timer down by 1
    // when current time runs out, alternates new Session or Break
    this.stepDown = function() {
      if (currentTime > 0) {
        currentTime --;
        this.displayCurrentTime();
        if (currentTime === 0) {
          if (type === "Session") {
            currentTime = breakTime;
            startTime = breakTime;
            type = "Break";
            this.displaySessionCount();
            endAudio.play();
          } else {
            sessionCount ++;
            currentTime = sessionTime;
            startTime = sessionTime;
            type = "Session";
            this.displaySessionCount();
            startAudio.play();
          }
        }
      }
    }
    
    // reset the timer
    this.reset = function() {
      clearInterval(timer);
      active = false;
      type = "Session";
      currentTime = sessionTime;
      sessionCount = 0;
      $('.time-start').text('Start');
      this.displayCurrentTime();
      this.displaySessionTime();
      this.displaySessionCount();
    }
  }
});