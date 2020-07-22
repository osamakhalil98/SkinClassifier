const result = document.getElementById("final-result");
const MEAN = tf.scalar(159.76482576825822);
let imageTitle = document.getElementById("image_title");
let predTitle = document.getElementById("pred_title");
let resultDesc = document.getElementById("result_desc");
const STD = 47.742128227990456;
$("#image-selector").change(function () {
  let reader = new FileReader();
  reader.onload = function () {
    let dataURL = reader.result;
    $("#selected-image").attr("src", dataURL);
    $("#prediction-list").empty();
  };

  let file = $("#image-selector").prop("files")[0];
  reader.readAsDataURL(file);
  imageTitle.style =
    "opacity:100; font-family: 'Merriweather', serif; text-align:left;";
  result.innerText = "";
  resultDesc.innerText = "";
});

let model;
$(document).ready(async function () {
  $(".progress-bar").show();
  console.log("Loading model...");
  model = await tf.loadLayersModel("model/model.json");
  console.log("Model loaded.");
  $(".progress-bar").hide();
});

$("#predict-button").click(async function () {
  let image = $("#selected-image").get(0);
  // Pre-process the image
  console.log("Loading image...");
  let tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([75, 100]) // change the image size
    .expandDims(0);
  //.toFloat();
  //.div(tf.scalar(255.0));
  console.log(tensor.shape);
  let sub = tensor.sub(MEAN);
  let normalizedImage = sub.div(STD);
  let predictions = await model.predict(normalizedImage).data();
  let top5 = Array.from(predictions)
    .map(function (p, i) {
      // this is Array.map
      return {
        probability: p,
        className: TARGET_CLASSES[i], // we are selecting the value from the obj
      };
    })
    .sort(function (a, b) {
      return b.probability - a.probability;
    });

  $("#prediction-list").empty();
  top5.forEach(function (p) {
    $("#prediction-list").append(
      `<li style="font-family: 'Roboto', sans-serif;"><strong>${
        p.className
      }: ${p.probability.toFixed(6)}</strong></li>`
    );
  });
  if (top5[0].className == "Actinic keratose") {
    let desc =
      "Actinic keratosis (AK), sometimes called solar keratosis or senile keratosis, is a pre-cancerous area of thick, scaly, or crusty skin. Actinic keratosis is a disorder (-osis) of epidermal keratinocytes that is induced by ultraviolet (UV) light exposure (actin-). These growths are more common in fair-skinned people and those who are frequently in the sun.";
    resultDesc.innerText = desc;
  }
  if (top5[0].className == "Basal cell carcinoma") {
    let desc =
      "Basal-cell carcinoma (BCC), also known as basal-cell cancer, is the most common type of skin cancer. It often appears as a painless raised area of skin, which may be shiny with small blood vessels running over it. It may also present as a raised area with ulceration. Basal-cell cancer grows slowly and can damage the tissue around it, but it is unlikely to spread to distant areas or result in death.";
    resultDesc.innerText = desc;
  }
  if (top5[0].className == "Benign keratosis-like lesions") {
    let desc =
      "Benign keratosis is a generic class that includes seborrheic ker- atoses (senile wart), solar lentigo - which can be regarded a flat variant of seborrheic keratosis - and lichen-planus like keratoses (LPLK), which corresponds to a seborrheic keratosis or a solar lentigo with inflammation and regression.";
    resultDesc.innerText = desc;
  }
  if (top5[0].className == "Dermatofibroma") {
    let desc =
      "Dermatofibroma is a benign skin lesion regarded as either a benign proliferation or an inflammatory reaction to minimal trauma. It is brown often showing a central zone of fibrosis dermatoscopically, Dermatofibromas are small, harmless growths that appear on the skin. These growths, called nodules, can grow anywhere on the body, but are most common on the arms, lower legs, and upper back.";
    resultDesc.innerText = desc;
  }
  if (top5[0].className == "Melanoma") {
    let desc =
      "Melanoma, also known as malignant melanoma, is a type of skin cancer that develops from the pigment-producing cells known as melanocytes. Melanomas typically occur in the skin but may rarely occur in the mouth, intestines or eye (uveal melanoma). In women, they most commonly occur on the legs, while in men they most commonly occur on the back. About 25% of melanomas develop from moles. Changes in a mole that can indicate melanoma include an increase in size, irregular edges, change in color, itchiness or skin breakdown.";
    resultDesc.innerText = desc;
  }
  if (top5[0].className == "Melanocytic nevi") {
    let desc =
      "Melanocytic nevi are benign neoplasms or hamartomas composed of melanocytes, the pigment-producing cells that constitutively colonize the epidermis. Melanocytes are derived from the neural crest and migrate during embryogenesis to selected ectodermal sites (primarily the skin and the CNS), but also to the eyes and the ears.";
    resultDesc.innerText = desc;
  }
  if (top5[0].className == "Vascular lesions") {
    let desc =
      "Vascular lesions of the head and neck have historically been difficult to identify and diagnose without a biopsy accurately. In the past, the ability to correctly identify these lesions depended on the experience and the ability to watch the lesion evolve.";
    resultDesc.innerText = desc;
  }
  predTitle.style =
    "opacity:100; font-family: 'Merriweather', serif; text-align:left;";
  let final = `The result is <span style="color: dodgerblue"> <strong>
  ${top5[0].className}</strong></span>`;
  result.innerHTML = final;
});
