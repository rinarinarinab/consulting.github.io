// Активность меню
document.addEventListener("DOMContentLoaded", function () {
  var menuToggle = document.querySelector(".menu-toggle");
  var menuSection = document.querySelector(".menu-section");
  var navUl = document.querySelector("nav ul");

  menuToggle.addEventListener("click", function () {
    menuToggle.classList.toggle("on");
    menuSection.classList.toggle("on");
    navUl.classList.toggle("hidden");
  });
});

// Очистка действий после перехода на страницы
window.addEventListener("popstate", function (event) {
  if (event.state && event.state.previousLink) {
    const previousLink = document.querySelector(event.state.previousLink);

    previousLink.disabled = true;
  }
});

window.onbeforeunload = function (event) {
  const currentLink = window.location.href;
  history.pushState({ previousLink: currentLink }, null, currentLink);
};

// категорирование ИСПДн
function result21() {
  var objugr = document.getElementById("ugroza");
  var ugroza = Number(objugr.options[objugr.selectedIndex].value);
  var objispdn = document.getElementById("type_ispdn");
  var type_ispdn = objispdn.options[objispdn.selectedIndex].value;
  var objsotr = document.getElementById("type_sotrud");
  var type_sotrud = objsotr.options[objsotr.selectedIndex].value;
  var objkol = document.getElementById("kol-vo");
  var kolvo = objkol.options[objkol.selectedIndex].value;
  var class_ispdn;

  if (type_ispdn === "s22") {
    // если биометрическая
    class_ispdn = ugroza;
  } else {
    // если не биометрическая
    if (type_ispdn === "s21") {
      // если спец
      if (ugroza === 1) {
        class_ispdn = ugroza;
      } else {
        if (type_sotrud === "s31") {
          // если сотрудники
          class_ispdn = ugroza;
        } else {
          if (kolvo === "s41") {
            // если менее 100000
            class_ispdn = ugroza;
          } else {
            class_ispdn = ugroza - 1; // если более 100000
          }
        }
      }
    } else if (type_ispdn === "s23") {
      // если общедост
      if (ugroza === 1 || ugroza === 3 || type_sotrud === "s31") {
        class_ispdn = ugroza + 1;
      } else {
        if (kolvo === "s41") {
          // если менее 100000
          class_ispdn = ugroza + 1;
        } else {
          class_ispdn = ugroza; // если более 100000
        }
      }
    } else if (type_ispdn === "s24") {
      // если иная система
      if (ugroza === 1 || (kolvo === "s42" && type_sotrud === "s32")) {
        class_ispdn = ugroza;
      } else {
        class_ispdn = ugroza + 1; // если более 100000
      }
    }
  }

  // реализация активации - деактивации списков
  if (ugroza === 1) {
    objkol.setAttribute("disabled", "disabled");
    objsotr.setAttribute("disabled", "disabled");
  } else {
    if (type_ispdn === "s22") {
      // если биометрическая
      objkol.setAttribute("disabled", "disabled");
      objsotr.setAttribute("disabled", "disabled");
    } else {
      // если не биометрическая
      objsotr.removeAttribute("disabled");
      if (type_sotrud === "s31") {
        // деактивация списка количество
        objkol.setAttribute("disabled", "disabled");
      } else {
        objkol.removeAttribute("disabled");
      }
    }
    if (type_ispdn === "s23" && ugroza === 3) {
      // если общедост
      objkol.setAttribute("disabled", "disabled");
      objsotr.setAttribute("disabled", "disabled");
    }
  }

  // Обновление значения
  document.getElementById("results21").value = class_ispdn;

  document.getElementById("results21").innerHTML = class_ispdn;
}

// категорирование ГИС
function result17() {
  var objkonf = document.getElementById("privacy");
  var konf = Number(objkonf.options[objkonf.selectedIndex].value);
  var objcelost = document.getElementById("integrity");
  var celost = Number(objcelost.options[objcelost.selectedIndex].value);
  var objdostup = document.getElementById("accessibility");
  var dostup = Number(objdostup.options[objdostup.selectedIndex].value);
  var objsize_is = document.getElementById("size_is");
  var size_is = objsize_is.options[objsize_is.selectedIndex].value;
  var important_lvl;
  var class_gis;

  important_lvl = Math.min(konf, celost, dostup);

  if (important_lvl === 1) {
    class_gis = 1;
  } else if (important_lvl === 2) {
    class_gis = 1;
    if (size_is === "reg" || size_is === "obj") {
      class_gis = 2;
    }
  } else if (important_lvl === 3) {
    class_gis = 2;
    if (size_is === "reg" || size_is === "obj") {
      class_gis = 3;
    }
  }

  // Обновление значения
  document.getElementById("results17").value = class_gis;
  document.getElementById("results17").innerHTML = class_gis;
}

// категорирование ЗОКИИ
function result187() {
  var class_kii;
  var lastValues = {}; // Объект для хранения последнего выбранного значения select
  var lastActiveSelectId; // Переменная для хранения id последнего активного select

  function handleSelectChange(select) {
    lastValues[select.id] = select.value; // Сохранение текущего значения select
    lastActiveSelectId = select.id; // Запоминание id последнего активного select

    console.log("Changed:", select.id, "Value:", select.value);

    calculateMaxClassKii(); // Пересчитываем максимальное значение КИИ

    updateResults(); // Обновляем результаты на странице
  }

  // Обновление результатов на странице
  function updateResults() {
    const resultsElement = document.getElementById("results187");
    resultsElement.value = class_kii;
    resultsElement.innerHTML = class_kii;
    console.log("Updated Results:", class_kii);
  }

  // Вычисление максимального значения class_kii
  function calculateMaxClassKii() {
    var maxClassKii = -Infinity;
    document.querySelectorAll("select").forEach(function (select) {
      var value = select.value;
      var currentClassKii;

      switch (value) {
        case "1":
          currentClassKii = 1; // Вес для class_kii = 3
          break;
        case "2":
          currentClassKii = 2; // Вес для class_kii = 2
          break;
        case "3":
          currentClassKii = 3; // Вес для class_kii = 1
          break;
        case "4":
          currentClassKii = 0; // 'Система не ЗОКИИ' считается как 0 для вычисления максимального значения
          break;
        default:
          currentClassKii = -Infinity;
      }

      if (currentClassKii > maxClassKii) {
        maxClassKii = currentClassKii;
      }
    });

    if (maxClassKii === 0) {
      class_kii = "Система не ЗОКИИ";
    } else if (maxClassKii === -Infinity) {
      class_kii = null;
    } else {
      // Восстанавливаем исходное значение class_kii на основе веса
      switch (maxClassKii) {
        case 1:
          class_kii = 3;
          break;
        case 2:
          class_kii = 2;
          break;
        case 3:
          class_kii = 1;
          break;
      }
    }
  }

  // Функция для отмены последнего изменения
  function undoLastChange() {
    console.log("Undo Button Clicked");
    if (lastActiveSelectId) {
      var select = document.getElementById(lastActiveSelectId);
      select.value = "4"; // Восстановление значения на '4'
      console.log("Undo:", lastActiveSelectId, "to Value: 4");
      lastValues[select.id] = "4"; // Обновить сохраненное значение
      calculateMaxClassKii();
      updateResults();
    }
  }

  // Функция для сброса всех значений select на '4'
  function resetForm() {
    // Перебор всех элементов select на странице
    document.querySelectorAll("select").forEach(function (select) {
      select.value = "4"; // Установить значение '4' для каждого select
      console.log(`Сброс select с id ${select.id} на значение: 4`);
      lastValues[select.id] = "4"; // Обновить сохраненное значение
    });
    calculateMaxClassKii();
    updateResults();
  }

  // Начальная проверка
  function initialCheck() {
    document.querySelectorAll("select").forEach(function (select) {
      if (select.value === "4") {
        class_kii = "Система не ЗОКИИ";
      }
      lastValues[select.id] = select.value; // Сохранение начального значения
    });

    calculateMaxClassKii(); // Пересчитываем максимальное значение КИИ при инициализации
    updateResults();
    console.log("Initial Check Done");
  }

  // Убедитесь, что DOM загружен перед вызовом функции
  document.addEventListener("DOMContentLoaded", function () {
    // Добавление обработчиков событий для всех элементов select
    document.querySelectorAll("select").forEach(function (select) {
      select.addEventListener("change", function () {
        handleSelectChange(select); // Передача select в функцию handleSelectChange при изменении
      });
    });
    initialCheck(); // Выполнить проверку начальных значений

    // Обработчик для кнопки "Отмена"
    var undoButton = document.getElementById("undoButton");
    if (undoButton) {
      undoButton.addEventListener("click", undoLastChange); // Добавить обработчик для кнопки "Отмена"
      console.log("Обработчик для кнопки Отмена добавлен");
    } else {
      console.log("Кнопка Отмена не найдена");
    }

    // Обработчик для кнопки "Сброс"
    var resetButton = document.getElementById("resetButton");
    if (resetButton) {
      resetButton.addEventListener("click", resetForm); // Добавить обработчик для кнопки "Сброс"
      console.log("Обработчик для кнопки Сброс добавлен");
    } else {
      console.log("Кнопка Сброс не найдена");
    }
  });
}

result187();

// категорирование АСУ ТП
function result489() {
  var objkonf = document.getElementById("privacy_asu");
  var objcelost = document.getElementById("integrity_asu");
  var objdostup = document.getElementById("accessibility_asu");
  var konf = Number(objkonf.options[objkonf.selectedIndex].value);
  var celost = Number(objcelost.options[objcelost.selectedIndex].value);
  var dostup = Number(objdostup.options[objdostup.selectedIndex].value);

  var max_lvl = Math.min(konf, celost, dostup);
  var class_asu;

  if (max_lvl === 3) {
    class_asu = 3;
  } else if (max_lvl === 2) {
    class_asu = 2;
  } else {
    class_asu = 1;
  }

  // Обновление значения
  document.getElementById("results489").value = class_asu;
  document.getElementById("results489").innerHTML = class_asu;
}

// СКАЧИВАНИЕ ФАЙЛОВ
// Функция изменения URL для ссылки на скачивание
document.addEventListener("DOMContentLoaded", function () {
  // Вспомогательная функция для получения элемента по ID и проверки его существования
  function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Элемент с id "${id}" не найден.`);
    }
    return element;
  }

  // Вспомогательная функция для установки ссылки на скачивание и имени файла
  function setDownloadLink(href, filename) {
    const saveLink = getElement("save");
    if (saveLink) {
      saveLink.href = href;
      saveLink.download = filename;
    }
  }

  // Функция изменения URL для ссылки на скачивание
  function changeURL() {
    const checkbox_ispdn = document.getElementById("checkbox_ispdn")?.checked;
    const checkbox_gis = document.getElementById("checkbox_gis")?.checked;
    const checkbox_upgrade =
      document.getElementById("checkbox_upgrade")?.checked;
    const checkbox_skzi = document.getElementById("checkbox_skzi")?.checked;
    const checkbox_kii = document.getElementById("checkbox_kii")?.checked;
    const checkbox_pp1119 = document.getElementById("checkbox_pp1119")?.checked;
    const checkbox_asu = document.getElementById("checkbox_asu")?.checked;
    const results21 = document.getElementById("results21")?.innerText.trim();
    const results17 = document.getElementById("results17")?.innerText.trim();
    const results489 = document.getElementById("results489")?.innerText.trim();
    const results_kii = document
      .getElementById("results187_display")
      ?.innerText.trim();

    // Определение условий для установки ссылки на скачивание в зависимости от выбранных параметров
    if (
      checkbox_upgrade &&
      checkbox_ispdn &&
      checkbox_gis &&
      results21 &&
      results17
    ) {
      switch (results21) {
        case "1":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_11_usil.docx",
                "ispdn_gis_11_usil.docx"
              );
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_12_usil.docx",
                "ispdn_gis_12_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_13_usil.docx",
                "ispdn_gis_13_usil.docx"
              );
              break;
          }
          break;
        case "2":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_21_usil.docx",
                "ispdn_gis_21_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_22_usil.docx",
                "ispdn_gis_22_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_23_usil.docx",
                "ispdn_gis_23_usil.docx"
              );
              break;
          }
          break;
        case "3":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_31_usil.docx",
                "ispdn_gis_31_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_32_usil.docx",
                "ispdn_gis_32_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_33_usil.docx",
                "ispdn_gis_33_usil.docx"
              );
              break;
          }
          break;
        case "4":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_41_usil.docx",
                "ispdn_gis_41_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_42_usil.docx",
                "ispdn_gis_42_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_43_usil.docx",
                "ispdn_gis_43_usil.docx"
              );
              break;
          }
          break;
      }
    } else if (checkbox_ispdn && checkbox_gis && results21 && results17) {
      switch (results21) {
        case "1":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_1/ispdn_gis_11.docx",
                "ispdn_gis_11.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_1/ispdn_gis_12.docx",
                "ispdn_gis_12.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_1/ispdn_gis_13.docx",
                "ispdn_gis_13.docx"
              );
              break;
          }
          break;
        case "2":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_2/ispdn_gis_21.docx",
                "ispdn_gis_21.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_2/ispdn_gis_22.docx",
                "ispdn_gis_22.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_2/ispdn_gis_23.docx",
                "ispdn_gis_23.docx"
              );
              break;
          }
          break;
        case "3":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_3/ispdn_gis_31.docx",
                "ispdn_gis_31.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_3/ispdn_gis_32.docx",
                "ispdn_gis_32.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_3/ispdn_gis_33.docx",
                "ispdn_gis_33.docx"
              );
              break;
          }
          break;
        case "4":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_4/ispdn_gis_41.docx",
                "ispdn_gis_41.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_4/ispdn_gis_42.docx",
                "ispdn_gis_42.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn+GIS/ISPDN_4/ispdn_gis_43.docx",
                "ispdn_gis_43.docx"
              );
              break;
          }
          break;
      }
    } else if (checkbox_ispdn && results21) {
      switch (results21) {
        case "1":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn/ispdn1.docx",
            "ispdn1.docx"
          );
          break;
        case "2":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn/ispdn2.docx",
            "ispdn2.docx"
          );
          break;
        case "3":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn/ispdn3.docx",
            "ispdn3.docx"
          );
          break;
        case "4":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ISPDn/ispdn4.docx",
            "ispdn4.docx"
          );
          break;
      }
    } else if (checkbox_gis && results17) {
      switch (results17) {
        case "1":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS/gis1.docx",
            "gis1.docx"
          );
          break;
        case "2":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS/gis2.docx",
            "gis2.docx"
          );
          break;
        case "3":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS/gis3.docx",
            "gis3.docx"
          );
          break;
      }
    }
    // СКЗИ
    if (
      checkbox_skzi &&
      checkbox_upgrade &&
      checkbox_ispdn &&
      checkbox_gis &&
      results21 &&
      results17
    ) {
      switch (results21) {
        case "1":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_11_usil.docx",
                "ispdn_gis_11_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_12_usil.docx",
                "ispdn_gis_12_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_13_usil.docx",
                "ispdn_gis_13_usil.docx"
              );
              break;
          }
          break;
        case "2":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_21_usil.docx",
                "ispdn_gis_21_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_22_usil.docx",
                "ispdn_gis_22_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_23_usil.docx",
                "ispdn_gis_23_usil.docx"
              );
              break;
          }
          break;
        case "3":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_31_usil.docx",
                "ispdn_gis_31_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_32_usil.docx",
                "ispdn_gis_32_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_33_usil.docx",
                "ispdn_gis_33_usil.docx"
              );
              break;
          }
          break;
        case "4":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_41_usil.docx",
                "ispdn_gis_41_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_42_usil.docx",
                "ispdn_gis_42_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_43_usil.docx",
                "ispdn_gis_43_usil.docx"
              );
              break;
          }
          break;
      }
    } else if (
      checkbox_skzi &&
      checkbox_ispdn &&
      checkbox_gis &&
      results21 &&
      results17
    ) {
      switch (results21) {
        case "1":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_1/ispdn_gis_11.docx",
                "ispdn_gis_11.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_1/ispdn_gis_12.docx",
                "ispdn_gis_12.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_1/ispdn_gis_13.docx",
                "ispdn_gis_13.docx"
              );
              break;
          }
          break;
        case "2":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_2/ispdn_gis_21.docx",
                "ispdn_gis_21.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_2/ispdn_gis_22.docx",
                "ispdn_gis_22.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_2/ispdn_gis_23.docx",
                "ispdn_gis_23.docx"
              );
              break;
          }
          break;
        case "3":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_3/ispdn_gis_31.docx",
                "ispdn_gis_31.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_3/ispdn_gis_32.docx",
                "ispdn_gis_32.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_3/ispdn_gis_33.docx",
                "ispdn_gis_33.docx"
              );
              break;
          }
          break;
        case "4":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_4/ispdn_gis_41.docx",
                "ispdn_gis_41.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_4/ispdn_gis_42.docx",
                "ispdn_gis_42.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn+GIS/ISPDN_4/ispdn_gis_43.docx",
                "ispdn_gis_43.docx"
              );
              break;
          }
          break;
      }
    } else if (checkbox_skzi && checkbox_ispdn && results21) {
      switch (results21) {
        case "1":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn/ispdn1.docx",
            "ispdn1.docx"
          );
          break;
        case "2":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn/ispdn2.docx",
            "ispdn2.docx"
          );
          break;
        case "3":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn/ispdn3.docx",
            "ispdn3.docx"
          );
          break;
        case "4":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/ISPDn/ispdn4.docx",
            "ispdn4.docx"
          );
          break;
      }
    } else if (checkbox_skzi && checkbox_gis && results17) {
      switch (results17) {
        case "1":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/GIS/gis1.docx",
            "gis1.docx"
          );
          break;
        case "2":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/GIS/gis2.docx",
            "gis2.docx"
          );
          break;
        case "3":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/SKZI/GIS/gis3.docx",
            "gis3.docx"
          );
          break;
      }
    }

    // ПП 1119 + СКЗИ
    else if (
      checkbox_pp1119 &&
      checkbox_skzi &&
      checkbox_ispdn &&
      checkbox_gis &&
      results21 &&
      results17
    ) {
      switch (results21) {
        case "1":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_11_usil.docx",
                "ispdn_gis_11_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_12_usil.docx",
                "ispdn_gis_12_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_13_usil.docx",
                "ispdn_gis_13_usil.docx"
              );
              break;
          }
          break;
        case "2":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_21_usil.docx",
                "ispdn_gis_21_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_22_usil.docx",
                "ispdn_gis_22_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_23_usil.docx",
                "ispdn_gis_23_usil.docx"
              );
              break;
          }
          break;
        case "3":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_31_usil.docx",
                "ispdn_gis_31_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_32_usil.docx",
                "ispdn_gis_32_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_33_usil.docx",
                "ispdn_gis_33_usil.docx"
              );
              break;
          }
          break;
        case "4":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_41_usil.docx",
                "ispdn_gis_41_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_42_usil.docx",
                "ispdn_gis_42_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_43_usil.docx",
                "ispdn_gis_43_usil.docx"
              );
              break;
          }
          break;
      }
    } else if (
      checkbox_pp1119 &&
      checkbox_skzi &&
      checkbox_ispdn &&
      checkbox_gis &&
      results21 &&
      results17
    ) {
      switch (results21) {
        case "1":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_1/ispdn_gis_11.docx",
                "ispdn_gis_11.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_1/ispdn_gis_12.docx",
                "ispdn_gis_12.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_1/ispdn_gis_13.docx",
                "ispdn_gis_13.docx"
              );
              break;
          }
          break;
        case "2":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_2/ispdn_gis_21.docx",
                "ispdn_gis_21.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_2/ispdn_gis_22.docx",
                "ispdn_gis_22.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_2/ispdn_gis_23.docx",
                "ispdn_gis_23.docx"
              );
              break;
          }
          break;
        case "3":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_3/ispdn_gis_31.docx",
                "ispdn_gis_31.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GISISPDN_3/ispdn_gis_32.docx",
                "ispdn_gis_32.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_3/ispdn_gis_33.docx",
                "ispdn_gis_33.docx"
              );
              break;
          }
          break;
        case "4":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_4/ispdn_gis_41.docx",
                "ispdn_gis_41.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_4/ispdn_gis_42.docx",
                "ispdn_gis_42.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn+GIS/ISPDN_4/ispdn_gis_43.docx",
                "ispdn_gis_43.docx"
              );
              break;
          }
          break;
      }
    }
    if (checkbox_pp1119 && checkbox_skzi && checkbox_ispdn && results21) {
      switch (results21) {
        case "1":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn/ispdn1.docx",
            "ispdn1.docx"
          );
          break;
        case "2":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn/ispdn2.docx",
            "ispdn2.docx"
          );
          break;
        case "3":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn/ispdn3.docx",
            "ispdn3.docx"
          );
          break;
        case "4":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/SKZI/ISPDn/ispdn4.docx",
            "ispdn4.docx"
          );
          break;
      }
    }

    // ПП 1119
    if (
      checkbox_pp1119 &&
      checkbox_ispdn &&
      checkbox_gis &&
      results21 &&
      results17
    ) {
      switch (results21) {
        case "1":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_1/ispdn_gis_11.docx",
                "ispdn_gis_11.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_1/ispdn_gis_12.docx",
                "ispdn_gis_12.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_1/ispdn_gis_13.docx",
                "ispdn_gis_13.docx"
              );
              break;
          }
          break;
        case "2":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_2/ispdn_gis_21.docx",
                "ispdn_gis_21.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_2/ispdn_gis_22.docx",
                "ispdn_gis_22.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_2/ispdn_gis_23.docx",
                "ispdn_gis_23.docx"
              );
              break;
          }
          break;
        case "3":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_3/ispdn_gis_31.docx",
                "ispdn_gis_31.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_3/ispdn_gis_32.docx",
                "ispdn_gis_32.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_3/ispdn_gis_33.docx",
                "ispdn_gis_33.docx"
              );
              break;
          }
          break;
        case "4":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_4/ispdn_gis_41.docx",
                "ispdn_gis_41.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_4/ispdn_gis_42.docx",
                "ispdn_gis_42.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_4/ispdn_gis_43.docx",
                "ispdn_gis_43.docx"
              );
              break;
          }
          break;
      }
    }
    if (
      checkbox_pp1119 &&
      checkbox_upgrade &&
      checkbox_ispdn &&
      checkbox_gis &&
      results21 &&
      results17
    ) {
      switch (results21) {
        case "1":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_11_usil.docx",
                "ispdn_gis_11_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_12_usil.docx",
                "ispdn_gis_12_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_1/ISPDn_GISusil/ispdn_gis_13_usil.docx",
                "ispdn_gis_13_usil.docx"
              );
              break;
          }
          break;
        case "2":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_21_usil.docx",
                "ispdn_gis_21_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_22_usil.docx",
                "ispdn_gis_22_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_2/ISPDn_GISusil/ispdn_gis_23_usil.docx",
                "ispdn_gis_23_usil.docx"
              );
              break;
          }
          break;
        case "3":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_31_usil.docx",
                "ispdn_gis_31_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_32_usil.docx",
                "ispdn_gis_32_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_3/ISPDn_GISusil/ispdn_gis_33_usil.docx",
                "ispdn_gis_33_usil.docx"
              );
              break;
          }
          break;
        case "4":
          switch (results17) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_41_usil.docx",
                "ispdn_gis_41_usil.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_42_usil.docx",
                "ispdn_gis_42_usil.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn+GIS/ISPDN_4/ISPDn_GISusil/ispdn_gis_43_usil.docx",
                "ispdn_gis_43_usil.docx"
              );
              break;
          }
          break;
      }
    } else if (checkbox_pp1119 && checkbox_ispdn && results21) {
      switch (results21) {
        case "1":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn/ispdn1.docx",
            "ispdn1.docx"
          );
          break;
        case "2":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn/ispdn2.docx",
            "ispdn2.docx"
          );
          break;
        case "3":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn/ispdn3.docx",
            "ispdn3.docx"
          );
          break;
        case "4":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/PP1119/ISPDn/ispdn4.docx",
            "ispdn4.docx"
          );
          break;
      }
    }
    // АСУ ТП
    if (checkbox_asu && results489) {
      switch (results489) {
        case "1":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ASU/asu1.docx",
            "asu1.docx"
          );
          break;
        case "2":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ASU/asu2.docx",
            "asu2.docx"
          );
          break;
        case "3":
          setDownloadLink(
            "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/ASU/asu3.docx",
            "asu3.docx"
          );
          break;
      }
    }

    // GIS + KII
    if (checkbox_kii && checkbox_gis && results17 && results_kii) {
      switch (results17) {
        case "1":
          switch (results_kii) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS+KII/gis1/gis_kii_11.docx",
                "gis_kii_11.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS+KII/gis1/gis_kii_12.docx",
                "gis_kii_12.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS+KII/gis1/gis_kii_13.docx",
                "gis_kii_13.docx"
              );
              break;
          }
          break;
        case "2":
          switch (results_kii) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS+KII/gis2/gis_kii_21.docx",
                "gis_kii_21.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS+KII/gis2/gis_kii_22.docx",
                "gis_kii_22.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS+KII/gis2/gis_kii_23.docx",
                "gis_kii_23.docx"
              );
              break;
          }
          break;
        case "3":
          switch (results_kii) {
            case "1":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS+KII/gis3/gis_kii_31.docx",
                "gis_kii_31.docx"
              );
              break;
            case "2":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS+KII/gis3/gis_kii_32.docx",
                "gis_kii_32.docx"
              );
              break;
            case "3":
              setDownloadLink(
                "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/GIS+KII/gis3/gis_kii_33.docx",
                "gis_kii_33.docx"
              );
              break;
          }
          break;
      }
    }
  }

  // Добавление слушателей событий к чекбоксам и элементам, которые могут изменить URL
  document
    .getElementById("checkbox_ispdn")
    ?.addEventListener("change", changeURL);
  document
    .getElementById("checkbox_gis")
    ?.addEventListener("change", changeURL);
  document
    .getElementById("checkbox_upgrade")
    ?.addEventListener("change", changeURL);
  document
    .getElementById("checkbox_skzi")
    ?.addEventListener("change", changeURL);
  document
    .getElementById("checkbox_pp1119")
    ?.addEventListener("change", changeURL);
  document
    .getElementById("checkbox_asu")
    ?.addEventListener("change", changeURL);
  document.getElementById("results21")?.addEventListener("change", changeURL);
  document.getElementById("results17")?.addEventListener("change", changeURL);
  document.getElementById("results489")?.addEventListener("change", changeURL);

  // Начальная установка ссылки на скачивание
  changeURL();
});

// saveLinkKii ЗОКИИ
// Вспомогательная функция для получения элемента по ID и проверки его существования
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Элемент с id "${id}" не найден.`);
  }
  return element;
}

// Вспомогательная функция для установки ссылки на скачивание и имени файла
function setDownloadLink(element, href, filename) {
  if (element) {
    element.href = href;
    element.download = filename;
  }
}

function changeURL_kii() {
  const saveLinkKii = getElement("save_info_kii");
  const results187Element = getElement("results187");
  if (!saveLinkKii || !results187Element) return;

  const results187 = parseInt(results187Element.innerText.trim(), 10);

  // Сброс ссылки на скачивание
  setDownloadLink(saveLinkKii, "", "");

  // ФАЙЛЫ, ЛОГИКА
  switch (results187) {
    case 1:
      setDownloadLink(
        saveLinkKii,
        "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/KII/kii1.docx",
        "kii1.docx"
      );
      break;
    case 2:
      setDownloadLink(
        saveLinkKii,
        "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/KII/kii2.docx",
        "kii2.docx"
      );
      break;
    case 3:
      setDownloadLink(
        saveLinkKii,
        "https://github.com/rinarinarinab/consulting.github.io/raw/main/files/KII/kii3.docx",
        "kii3.docx"
      );
      break;
  }
}

// Добавление слушателей событий
document.addEventListener("DOMContentLoaded", () => {
  getElement("results187")?.addEventListener("change", changeURL_kii);

  // Начальная установка ссылки на скачивание
  changeURL_kii();
});

// Обновление ссылки при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  changeURL_kii();
});

// диалоговые окна
document.addEventListener("DOMContentLoaded", () => {
  // Находим все кнопки "Показать модальное окно" и связанные с ними модальные окна
  const showModalButtons = document.querySelectorAll(".show");
  const dialogs = document.querySelectorAll(".dialogs");

  // Функция для активации кнопок по классу
  function activateButtons(className) {
    document.querySelectorAll(`button.${className}`).forEach((btn) => {
      btn.classList.toggle("active");
    });

    document.querySelectorAll("button").forEach((btn) => {
      if (
        !btn.classList.contains(className) &&
        btn.classList.contains("active")
      ) {
        btn.classList.remove("active");
      }
    });
  }

  // Добавляем обработчики кликов для каждой кнопки "Показать модальное окно"
  showModalButtons.forEach((showModalButton, index) => {
    showModalButton.addEventListener("click", () => {
      dialogs[index].showModal();
      showModalButton.setAttribute("disabled", "true");
    });

    // Находим кнопку закрытия для каждого модального окна
    const closeModalButton = dialogs[index].querySelector(".close");
    if (closeModalButton) {
      // Обработчик клика для кнопки закрытия модального окна
      closeModalButton.addEventListener("click", () => {
        dialogs[index].close();
        showModalButton.removeAttribute("disabled");
        showModalButton.focus(); // Устанавливаем фокус на кнопку "Показать модальное окно"

        // Активируем кнопку на несколько секунд
        showModalButton.classList.add("active");
        setTimeout(() => {
          showModalButton.classList.remove("active");
        }, 3000); // Задержка 3 секунды

        // Активируем кнопки с определенными классами на несколько секунд
        document
          .querySelectorAll(
            ".law_fz_149, .law_fz_187, .law_fz_152, .law_fz_161, .law_fz_86"
          )
          .forEach((button) => {
            showModalButton.classList.add("active");
            setTimeout(() => {
              button.classList.remove("active");
            }, 2000);
          });
      });
    }
  });

  // Обработчики кликов для кнопок в НПА
  document
    .querySelectorAll(
      ".law_fz_149, .law_fz_187, .law_fz_152, .law_fz_161, .law_fz_86"
    )
    .forEach((button) => {
      button.addEventListener("click", function () {
        const className = button.classList[0];
        activateButtons(className);
      });
    });
});

// перенос категории КИИ
function saveData() {
  var inputValue = document.getElementsByClassName("results187_input")[0].value; // Получаем значение первого элемента с классом results187_input
  localStorage.setItem("storedText", inputValue);
}

function displayStoredData() {
  var storedText = localStorage.getItem("storedText");
  if (storedText) {
    document.getElementById("results187_display").textContent = storedText;
  } else {
    document.getElementById("results187_display").textContent =
      "Значение не установлено";
  }
}

// Прослушиваем событие storage на изменения в localStorage
window.addEventListener("storage", function (event) {
  if (event.key === "storedText") {
    displayStoredData();
  }
});