/*
  Author: Camila Salinas Camacho
  GitHub Username: camilasalinasc
  Student Email: Camila_SalinasCamacho@student.uml.edu

  References / Sources:
    - jQuery Validation Plugin Documentation: https://jqueryvalidation.org/documentation/
    - jQuery UI Slider Documentation: https://api.jqueryui.com/slider/
    - jQuery UI Tabs Documentation: https://api.jqueryui.com/tabs/
    - Two-way binding implementation inspired by AngularJS concepts
*/

$(document).ready(function() {
  
  let tabCounter = 0; // Counter for unique tab IDs
  
  // Initialize tabs (starts with no tabs)
  $("#tabs").tabs();
  
  /**
   * Initializes a slider for a given input field
   * Implements two-way binding between slider and input
   */
  function initializeSlider(inputId, sliderId) {
    const input = $("#" + inputId);
    const slider = $("#" + sliderId);
    
    slider.slider({
      min: -50,
      max: 50,
      value: parseInt(input.val()) || 0,
      slide: function(event, ui) {
        // Update input when slider changes
        input.val(ui.value);
        input.valid(); // Trigger validation
      }
    });
    
    // Update slider when input changes
    input.on("input change", function() {
      const value = parseInt($(this).val());
      if (!isNaN(value) && value >= -50 && value <= 50) {
        slider.slider("value", value);
      }
    });
  }
  
  // Initialize all sliders
  initializeSlider("hStart", "slider-hStart");
  initializeSlider("hEnd", "slider-hEnd");
  initializeSlider("vStart", "slider-vStart");
  initializeSlider("vEnd", "slider-vEnd");
  
  // Custom validation methods
  $.validator.addMethod("lessThanOrEqual", function(value, element, param) {
    var target = $(param);
    return parseInt(value) <= parseInt(target.val());
  }, "Start value must be less than or equal to end value");

  $.validator.addMethod("greaterThanOrEqual", function(value, element, param) {
    var target = $(param);
    return parseInt(value) >= parseInt(target.val());
  }, "End value must be greater than or equal to start value");

  // Initialize jQuery Validation
  $("#tableForm").validate({
    rules: {
      hStart: {
        required: true,
        number: true,
        min: -50,
        max: 50,
        lessThanOrEqual: "#hEnd"
      },
      hEnd: {
        required: true,
        number: true,
        min: -50,
        max: 50,
        greaterThanOrEqual: "#hStart"
      },
      vStart: {
        required: true,
        number: true,
        min: -50,
        max: 50,
        lessThanOrEqual: "#vEnd"
      },
      vEnd: {
        required: true,
        number: true,
        min: -50,
        max: 50,
        greaterThanOrEqual: "#vStart"
      }
    },
    messages: {
      hStart: {
        required: "Please enter a horizontal start value",
        number: "Please enter a valid number",
        min: "Horizontal start must be at least -50",
        max: "Horizontal start must be at most 50",
        lessThanOrEqual: "Horizontal start must be ≤ horizontal end"
      },
      hEnd: {
        required: "Please enter a horizontal end value",
        number: "Please enter a valid number",
        min: "Horizontal end must be at least -50",
        max: "Horizontal end must be at most 50",
        greaterThanOrEqual: "Horizontal end must be ≥ horizontal start"
      },
      vStart: {
        required: "Please enter a vertical start value",
        number: "Please enter a valid number",
        min: "Vertical start must be at least -50",
        max: "Vertical start must be at most 50",
        lessThanOrEqual: "Vertical start must be ≤ vertical end"
      },
      vEnd: {
        required: "Please enter a vertical end value",
        number: "Please enter a valid number",
        min: "Vertical end must be at least -50",
        max: "Vertical end must be at most 50",
        greaterThanOrEqual: "Vertical end must be ≥ vertical start"
      }
    },
    errorElement: "span",
    errorPlacement: function(error, element) {
      error.addClass("error-msg");
      error.insertAfter(element.next('.slider'));
    },
    highlight: function(element) {
      $(element).addClass("error-input");
    },
    unhighlight: function(element) {
      $(element).removeClass("error-input");
    },
    submitHandler: function(form) {
      generateNewTable();
      return false;
    }
  });

  // Revalidate related fields when one changes
  $("#hStart").on("blur change", function() {
    $("#hEnd").valid();
  });
  
  $("#hEnd").on("blur change", function() {
    $("#hStart").valid();
  });
  
  $("#vStart").on("blur change", function() {
    $("#vEnd").valid();
  });
  
  $("#vEnd").on("blur change", function() {
    $("#vStart").valid();
  });



  /**
   * Generates a new table and adds it to a new tab
   */
  function generateNewTable() {
    const hStart = parseInt($("#hStart").val());
    const hEnd = parseInt($("#hEnd").val());
    const vStart = parseInt($("#vStart").val());
    const vEnd = parseInt($("#vEnd").val());
    
    tabCounter++;
    const tabId = "table-tab-" + tabCounter;
    const tabLabel = `[${hStart},${hEnd}] x [${vStart},${vEnd}]`;
    
    // Add new tab
    const tabTemplate = `<li><a href="#${tabId}">${tabLabel}</a> <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>`;
    $("#tabs ul").append(tabTemplate);
    
    const table = generateTableElement(hStart, hEnd, vStart, vEnd);
    $("#tabs").append(`<div id="${tabId}">${table}</div>`);
    
    // Refresh tabs widget
    $("#tabs").tabs("refresh");
    
    // Switch to the new tab
    const newTabIndex = $("#tabs ul li").length - 1;
    $("#tabs").tabs("option", "active", newTabIndex);
    
    // Show tabs section if it was hidden
    $("#tabs-section").show();
    
    // Update tab management checkboxes
    updateTabCheckboxes();
  }

  /**
   * Generates the HTML for a multiplication table
   */
  function generateTableElement(hStart, hEnd, vStart, vEnd) {
    let tableHTML = '<div class="table-wrapper"><table>';
    
    // Create header row
    tableHTML += '<thead><tr><th></th>';
    for (let h = hStart; h <= hEnd; h++) {
      tableHTML += `<th>${h}</th>`;
    }
    tableHTML += '</tr></thead>';
    
    // Create table body
    tableHTML += '<tbody>';
    for (let v = vStart; v <= vEnd; v++) {
      tableHTML += `<tr><th>${v}</th>`;
      for (let h = hStart; h <= hEnd; h++) {
        tableHTML += `<td>${v * h}</td>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table></div>';
    
    return tableHTML;
  }

  /**
   * Updates the checkboxes for tab deletion
   */
  function updateTabCheckboxes() {
    const checkboxContainer = $("#tab-checkboxes");
    checkboxContainer.empty();
    
    $("#tabs ul li").each(function(index) {
      const tabLabel = $(this).find("a").text();
      const tabId = $(this).find("a").attr("href").substring(1);
      
      const checkbox = `
        <div class="tab-checkbox">
          <input type="checkbox" id="cb-${tabId}" value="${tabId}">
          <label for="cb-${tabId}">${tabLabel}</label>
        </div>
      `;
      checkboxContainer.append(checkbox);
    });
    
    // Show/hide delete controls based on whether there are tabs
    if ($("#tabs ul li").length > 0) {
      $("#delete-controls").show();
    } else {
      $("#delete-controls").hide();
      $("#tabs-section").hide();
    }
  }

  /**
   * Deletes selected tabs
   */
  $("#delete-selected").on("click", function() {
    const selectedTabs = [];
    
    $("#tab-checkboxes input:checked").each(function() {
      selectedTabs.push($(this).val());
    });
    
    if (selectedTabs.length === 0) {
      alert("Please select at least one tab to delete.");
      return;
    }
    
    // Remove selected tabs
    selectedTabs.forEach(function(tabId) {
      const panelId = "#" + tabId;
      const tabAnchor = $('a[href="' + panelId + '"]').parent();
      
      // Remove the tab and its content
      tabAnchor.remove();
      $(panelId).remove();
    });
    
    // Refresh tabs and update checkboxes
    $("#tabs").tabs("refresh");
    
    // If there are still tabs, activate the first one, otherwise hide the tabs section
    if ($("#tabs ul li").length > 0) {
      $("#tabs").tabs("option", "active", 0);
    } else {
      $("#tabs-section").hide();
    }
    
    updateTabCheckboxes();
  });

  /**
   * Handle clicking the X button on individual tabs
   */
  $("#tabs").on("click", "span.ui-icon-close", function() {
    const panelId = $(this).closest("li").find("a").attr("href");
    const tabAnchor = $(this).closest("li");
    
    // Remove the tab and its content
    tabAnchor.remove();
    $(panelId).remove();
    
    // Refresh tabs and update checkboxes
    $("#tabs").tabs("refresh");
    
    // If there are still tabs, activate the first one, otherwise hide the tabs section
    if ($("#tabs ul li").length > 0) {
      $("#tabs").tabs("option", "active", 0);
    } else {
      $("#tabs-section").hide();
    }
    
    updateTabCheckboxes();
  });

  // Initialize with no delete controls visible and tabs section hidden
  $("#delete-controls").hide();
  $("#tabs-section").hide();
});