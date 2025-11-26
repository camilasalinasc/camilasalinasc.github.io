/*
  Author: Camila Salinas Camacho
  GitHub Username: camilasalinasc
  Student Email: Camila_SalinasCamacho@student.uml.edu

  References / Sources:
    - jQuery Validation Plugin Documentation: https://jqueryvalidation.org/documentation/
    - jQuery Validation Methods: https://jqueryvalidation.org/jQuery.validator.addMethod/
    - jQuery Validation Custom Messages: https://jqueryvalidation.org/jQuery.validator.messages/
*/

$(document).ready(function() {
  
  // Custom validation method to check if start is less than or equal to end
  $.validator.addMethod("lessThanOrEqual", function(value, element, param) {
    var target = $(param);
    return parseInt(value) <= parseInt(target.val());
  }, "Start value must be less than or equal to end value");

  // Custom validation method to check if end is greater than or equal to start
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
      // Place error message right after the input field
      error.addClass("error-msg");
      error.insertAfter(element);
    },
    highlight: function(element) {
      $(element).addClass("error-input");
    },
    unhighlight: function(element) {
      $(element).removeClass("error-input");
    },
    submitHandler: function(form) {
      // Only generate table if form is valid
      generateTable();
      return false; // Prevent default form submission
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
   * Generates the multiplication table based on validated input values
   */
  function generateTable() {
    const hStart = parseInt($("#hStart").val());
    const hEnd = parseInt($("#hEnd").val());
    const vStart = parseInt($("#vStart").val());
    const vEnd = parseInt($("#vEnd").val());
    const wrapper = $("#tableWrapper");
    
    // Clear previous table
    wrapper.empty();

    // Create table element
    const table = $("<table></table>");
    const thead = $("<thead></thead>");
    const tbody = $("<tbody></tbody>");

    // Create header row
    const headerRow = $("<tr></tr>");
    headerRow.append("<th></th>"); // top-left corner cell

    for (let h = hStart; h <= hEnd; h++) {
      headerRow.append($("<th></th>").text(h));
    }
    thead.append(headerRow);
    table.append(thead);

    // Create table body
    for (let v = vStart; v <= vEnd; v++) {
      const row = $("<tr></tr>");
      row.append($("<th></th>").text(v)); // row header

      for (let h = hStart; h <= hEnd; h++) {
        row.append($("<td></td>").text(v * h));
      }

      tbody.append(row);
    }

    table.append(tbody);
    wrapper.append(table);
  }
});
