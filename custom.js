let swiperInstance = null;
let removePriceTableResizeListener = null;
const priceOptionSelections = new WeakMap();
function price_table() {
  const pr_container = document.querySelector("[data-price-table]");
  if (pr_container != undefined) {
    const sliderEl = pr_container.querySelector(".ptr-grid-row");
    let resizeCardHeights = null;

    // Dynamically build validation sets from priceData
    const planSet = new Set(
      (typeof priceData !== "undefined" ? priceData : []).map((p) =>
        p.name.toLowerCase(),
      ),
    );
    const brokerSet = new Set();
    const sizeSet = new Set();
    (typeof priceData !== "undefined" ? priceData : []).forEach((p) => {
      p.broker.forEach((b) => {
        brokerSet.add(b.broker_name.toLowerCase());
        b.account_size.forEach((sz) => {
          sizeSet.add(sz.name.toLowerCase());
        });
      });
    });
    function getDiscountValue(couponCode, defaultVal = "price") {
      let setVal;
      const codeKey = couponCode ? couponCode.toLowerCase() : null;
      const details =
        codeKey && couponDetails[codeKey]
          ? couponDetails[codeKey]
          : couponDetails.default_code;
      if (defaultVal == "price") {
        setVal = Number(details[1]);
      } else {
        setVal = details[0].toUpperCase();
      }
      return setVal;
    }

    function customRound(num) {
      const decimal = num - Math.floor(num);
      if (decimal >= 0.5) {
        return Math.ceil(num);
      } else {
        return Math.floor(num);
      }
    }

    function getCardPrices(account, selections = {}, labels = []) {
      if (account.pricing?.combinations) {
        const { combinations, boostPercent = 0 } = account.pricing;
        const discountPercent = getDiscountValue(account.couponCode);
        const key = `${selections.daily_loss || 0}-${selections.consistency || 0}`;
        const base = Number(combinations[key] ?? combinations["0-0"] ?? account.price);
        const sale = selections.leverage && Number(boostPercent) > 0
          ? Math.ceil(base * (1 + boostPercent / 100) / 10) * 10 - 1
          : base;
        // Combination prices already include the promo, matching the reference.
        const list = discountPercent > 0
          ? Math.max(sale + 1, Math.round(sale / (1 - discountPercent / 100) / 10) * 10 - 1)
          : sale;
        return { sale, list, saving: list - sale };
      }
      // $100K accounts still use per-option percentage adjustments.
      const activeIndexes = labels.reduce((indexes, id, index) => {
        if (selections[id] > 0 && account.pricingOptions?.[index]?.value?.[0]?.[selections[id]] !== undefined) {
          indexes.push(index);
        }
        return indexes;
      }, []);
      const adjustment = activeIndexes.reduce((total, index) => {
        const others = activeIndexes.filter((other) => other !== index);
        const entry = account.pricingOptions[index].combination?.find(
          ([indexes]) => indexes.length === others.length &&
            others.every((other) => indexes.includes(other)),
        );
        return total + Number(entry?.[1] ?? 0);
      }, 0);
      const list = Math.max(0, Number(account.price) * (1 + adjustment / 100));
      const saving = list * getDiscountValue(account.couponCode) / 100;
      return { sale: list - saving, list, saving };
    }

    function initPricingOptions(plan, accounts, row) {
      const cards = Array.from(row.querySelectorAll(".prt-col-grid"));
      const normalizeLabel = (label) => String(label).toLowerCase()
        .replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")
        .replace(/^daily_loss_limit$/, "daily_loss");
      const findRules = (card, option) => Array.from(
        card.querySelectorAll("[data-rule-section]"),
      ).filter((rule) => rule.dataset.ruleSection === option.target &&
        normalizeLabel(rule.dataset.ruleLabel) === option.id);
      const getChoices = (account, option) => {
        const value = account.pricingOptions?.[option.index]?.value;
        if (!Array.isArray(value?.[0]) || !Array.isArray(value?.[1])) return [];
        return value[0].map((label, index) => ({ label, value: value[1][index] }));
      };
      cards.forEach((card, index) => {
        const account = accounts[index];
        // Array positions bind plan metadata, label IDs, and each account's values.
        // Display names are never used to infer an option's identity.
        const settings = (plan.pricingOptions || []).map((option, index) => ({
          ...option, index, id: plan.labels[index],
        })).filter((option) => option.id &&
          findRules(card, option).length && getChoices(account, option).length,
        );
        const selections = priceOptionSelections.get(account) || {};
        priceOptionSelections.set(account, selections);
        settings.forEach((option) => {
          if (!Number.isInteger(selections[option.id]) || selections[option.id] < 0 ||
            !getChoices(account, option)[selections[option.id]]) {
            selections[option.id] = 0;
          }
        });

        const radios = [];
        const ruleBindings = [];

        function createToggle(option, account, scope) {
          const group = document.createElement("div");
          group.className = "price-option-toggle compact";
          group.setAttribute("role", "radiogroup");
          group.setAttribute("aria-label", option.name);
          getChoices(account, option).forEach((choice, index) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "radio";
            input.name = `price-option-${plan.name}-${scope}-${option.id}`;
            input.value = String(index);
            input.dataset.priceOption = option.id;
            // Preserve null and numeric values without treating null as a fallback.
            input.dataset.actualValue = JSON.stringify(choice.value);
            const text = document.createElement("span");
            text.textContent = choice.label;
            label.append(input, text);
            group.appendChild(label);
            radios.push(input);
            input.addEventListener("change", () => {
              if (!input.checked) return;
              selections[option.id] = index;
              updateOptions();
              if (resizeCardHeights) resizeCardHeights();
              if (swiperInstance) swiperInstance.update(true);
            });
          });
          return group;
        }

        settings.forEach((option) => {
          if (!getChoices(account, option).length) return;
          findRules(card, option).forEach((rule, ruleIndex) => {
            rule.classList.add("price-option-rule");
            const label = rule.querySelector(".prt-mob-label");
            label.classList.add("price-option-rule-label");
            label.replaceChildren(
              document.createTextNode(`${option.name} `),
              ...Array.from(label.children),
            );
            rule.querySelectorAll(".prt-mob-data:not(.flex)").forEach((value, valueIndex) => {
              value.replaceChildren(createToggle(
                option, account, `card-${index}-${option.index}-row-${ruleIndex}-value-${valueIndex}`,
              ));
              ruleBindings.push({ value, account, option });
            });
          });
        });

        function updateOptions() {
          radios.forEach((radio) => {
            radio.checked = selections[radio.dataset.priceOption] === Number(radio.value);
          });
          ruleBindings.forEach(({ value, account, option }) => {
            const choice = getChoices(account, option)[selections[option.id]];
            value.dataset.actualValue = JSON.stringify(choice.value);
            value.classList.toggle("tdfy-blue", String(choice.label).toLowerCase() === "none");
          });
          const activeSelections = Object.fromEntries(settings.map((option) =>
            [option.id, selections[option.id]],
          ));
          const { sale, list, saving } = getCardPrices(account, activeSelections, plan.labels);
          // Keep the account placement and append parameters from every enabled option.
          const baseParams = new URLSearchParams(account.placementId);
          const placementParams = new URLSearchParams(baseParams);
          settings.forEach((option) => {
            if (!(activeSelections[option.id] > 0)) return;
            const extraParams = new URLSearchParams(account.pricingOptions[option.index].placementId || "");
            extraParams.forEach((value, key) => {
              if (!baseParams.has(key)) placementParams.append(key, value);
            });
          });
          const placementKeys = new Set();
          [account.placementId, ...(account.pricingOptions || []).map((option) => option.placementId)]
            .forEach((placement) => new URLSearchParams(placement || "").forEach((_, key) => placementKeys.add(key)));
          card.querySelectorAll("a.tdfy-price-btn").forEach((link) => {
            const url = new URL(link.href);
            placementKeys.forEach((key) => url.searchParams.delete(key));
            placementParams.forEach((value, key) => url.searchParams.append(key, value));
            const href = typeof window.carryForwardParams === "function"
              ? window.carryForwardParams(url.href) : url.href;
            if (link.href !== href) link.href = href;
          });
          card.querySelectorAll(".new_price_current > div").forEach((element) => {
            element.textContent = `$${customRound(sale)}`;
          });
          card.querySelectorAll(".new_price_prev").forEach((element) => {
            element.style.display = saving ? "block" : "none";
            element.firstElementChild.textContent = `$${customRound(list)}`;
          });
          card.querySelectorAll(".price_details_cp_tag").forEach((element) => {
            element.style.opacity = saving ? "1" : "0";
            element.firstElementChild.textContent = `Save $${customRound(saving)} with code ${getDiscountValue(account.couponCode, "code")}`;
          });
        }

        updateOptions();
      });
    }

    function escapeAttribute(value) {
      return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function destroySwiper() {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
      }

      const container = pr_container.querySelector(".new_price_details_inr");
      if (container) {
        container.classList.remove("swiper");
        const paginationEl = container.querySelector(".swiper-pagination");
        if (paginationEl) paginationEl.style.display = "none";
      }
      if (sliderEl) {
        sliderEl.classList.remove("swiper-wrapper");
        sliderEl.style.transform = "";
        sliderEl.querySelectorAll(".prt-col-grid").forEach((slide) => {
          slide.classList.remove("swiper-slide");
        });
      }
    }

    function initMobileSlider() {
      const container = pr_container.querySelector(".new_price_details_inr");
      if (!container || !sliderEl) return;

      const slides = sliderEl.querySelectorAll(".prt-col-grid");
      const rowStyles = getComputedStyle(sliderEl);
      const containerStyles = getComputedStyle(container);
      const availableWidth =
        container.clientWidth -
        (parseFloat(containerStyles.paddingLeft) || 0) -
        (parseFloat(containerStyles.paddingRight) || 0);
      const cardsWidth =
        Array.from(slides).reduce((width, slide) => {
          const styles = getComputedStyle(slide);
          return (
            width +
            slide.getBoundingClientRect().width +
            (parseFloat(styles.marginLeft) || 0) +
            (parseFloat(styles.marginRight) || 0)
          );
        }, 0) +
        Math.max(0, slides.length - 1) * (parseFloat(rowStyles.columnGap) || 0);

      if (!slides.length || cardsWidth <= availableWidth + 1) {
        destroySwiper();
        return;
      }
      if (availableWidth <= 0 || typeof Swiper === "undefined") return;

      let paginationEl = container.querySelector(".swiper-pagination");
      if (!paginationEl) {
        paginationEl = document.createElement("div");
        paginationEl.className = "swiper-pagination";
        container.appendChild(paginationEl);
      }
      paginationEl.style.display = "flex";
      container.classList.add("swiper");
      sliderEl.classList.add("swiper-wrapper");
      slides.forEach((slide) => slide.classList.add("swiper-slide"));

      if (swiperInstance) {
        swiperInstance.update(true);
      } else {
        swiperInstance = new Swiper(container, {
          wrapperClass: "ptr-grid-row",
          slideClass: "prt-col-grid",
          slidesPerView: "auto",
          centeredSlides: false,
          // Swiper 3 uses a pagination element and a separate clickable option.
          pagination: paginationEl,
          paginationClickable: true,
        });
      }
    }

    // On resize
    if (removePriceTableResizeListener) removePriceTableResizeListener();
    function handleResize() {
      initMobileSlider();
      if (resizeCardHeights) resizeCardHeights();
    }
    window.addEventListener("resize", handleResize);
    removePriceTableResizeListener = () => {
      window.removeEventListener("resize", handleResize);
    };

    function init() {
      const all_type = pr_container.querySelectorAll(
        "input[type='radio'][name='plan_name']",
      );
      const all_acc_broker = pr_container.querySelectorAll(
        "input[type='radio'][name='plan_broker']",
      );

      const prms = new URLSearchParams(window.location.search);
      const planParam = prms.get("plan")?.toLowerCase();
      const sizeParam = prms.get("size")?.toLowerCase();
      const platformParam = prms.get("platform")?.toLowerCase();

      // Validate query params once and log if invalid/missing in inputs
      if (prms.has("plan")) {
        const planVal = prms.get("plan");
        if (!planSet.has(planVal.toLowerCase())) {
          console.log(`invalid parameter value, plan_name=${planVal}`);
        }
      }

      if (prms.has("size")) {
        const sizeVal = prms.get("size");
        if (!sizeSet.has(sizeVal.toLowerCase())) {
          console.log(`invalid parameter value, plan_name=${sizeVal}`);
        }
      }

      if (prms.has("platform")) {
        const platformVal = prms.get("platform");
        if (!brokerSet.has(platformVal.toLowerCase())) {
          console.log(`invalid parameter value, plan_name=${platformVal}`);
        }
      }

      all_type.forEach((el) => {
        el.checked = planParam ? el.value.toLowerCase() === planParam : false;
        el.addEventListener("change", createTable);
      });

      all_acc_broker.forEach((el) => {
        el.checked = platformParam
          ? el.value.toLowerCase() === platformParam
          : false;
        el.addEventListener("change", createTable);
      });

      setTimeout(() => {
        createTable();
        if (prms.has("plan") || prms.has("size") || prms.has("platform")) {
          pr_container.scrollIntoView({ behavior: "smooth" });
        }
      }, 400);
    }

    function createTable() {
      const all_type = pr_container.querySelectorAll(
          "input[type='radio'][name='plan_name']",
        ),
        all_acc_broker = pr_container.querySelectorAll(
          "input[type='radio'][name='plan_broker']",
        ),
        all_rules = pr_container.querySelectorAll(
          "input[type='radio'][name='plan_rule']",
        );

      const param = {
        name: pr_container
          .querySelector("input[type='radio'][name='plan_name']:checked")
          ?.value?.toLowerCase(),
        broker: pr_container
          .querySelector("input[type='radio'][name='plan_broker']:checked")
          ?.value?.toLowerCase(),
      };

      // Find plan (Growth / Select / Lightning)
      const isPlanSelected = priceData.map((p) => {
        return {
          name: p.name.toLowerCase(),
          isSelected: p.isSelected,
        };
      });
      all_type.forEach((pln) => {
        isPlanSelected.map((p) => {
          if (pln.checked) {
            pln.closest("label").classList.add("active");
            return;
          } else {
            pln.closest("label").classList.remove("active");
            if (
              p.name === pln.value.toLowerCase() &&
              p.isSelected &&
              !param.name
            ) {
              pln.closest("label").classList.add("active");
              pln.checked = true;
              param.name = p.name;
              return;
            }
          }
        });
      });

      // Find broker (Tradovate / projectX)
      const selectedPlan = priceData.find(
        (plan) => plan.name.toLowerCase() === param.name,
      );
      const brokerNames = selectedPlan.broker.map((b) => ({
        name: b.broker_name.toLowerCase(),
        isSelected: b.isSelected,
      }));
      const defaultBroker = brokerNames.find((b) => b.isSelected)?.name,
        brokerExists = brokerNames.some(
          (b) => b.name === param.broker?.toLowerCase(),
        );
      if (!brokerExists) {
        param.broker = defaultBroker;
      }
      all_acc_broker.forEach((bkr) => {
        const inputValue = bkr.value.toLowerCase();
        const label = bkr.closest("label");
        label.classList.remove("active", "disabled");
        const match = brokerNames.find((b) => b.name === inputValue);
        if (!match) {
          label.classList.add("disabled");
          bkr.checked = false;
          return;
        }
        if (param.broker === inputValue) {
          bkr.checked = true;
          label.classList.add("active");
        } else {
          bkr.checked = false;
        }
      });

      //Find plan sizes (25K / 50K / 100K / 150K)
      const selectedBroker = selectedPlan.broker.find(
        (br) => br.broker_name.toLowerCase() === param.broker.toLowerCase(),
      );
      const sizeItems = selectedBroker.account_size.map((sz) => ({
        name: sz.name.toLowerCase(),
        isSelected: sz.isSelected,
        price: sz.price,
        discount: getDiscountValue(sz.couponCode),
        subscription: sz.subscription,
      }));

      const defaultSize =
        sizeItems.find((s) => s.isSelected)?.name || sizeItems[0]?.name;
      let sizeExists = sizeItems.some(
        (s) => s.name === param.value?.toLowerCase(),
      );
      if (!sizeExists) {
        param.value = defaultSize;
      }

      const pr_table_wrapper = document.querySelector(
        ".new_price_details_wrapper",
      );
      if (pr_table_wrapper) {
        const all_classes = [...pr_table_wrapper.classList];
        all_classes.forEach((cls) => {
          if (cls.startsWith("dny_cla")) {
            //remove previous class from the wrapper
            pr_table_wrapper.classList.remove(cls);
          }
        });
        //add class after all selected radio in wrapper
        pr_table_wrapper.classList.add(
          `dny_class_${param.name}`,
          `dny_class_${param.value}`,
          `dny_class_${param.broker}`,
        );
      }

      //render data
      const v3_table = pr_container.querySelector(".new_price_details");
      if (v3_table) {
        v3_table.classList.remove("loaded");
        const rightColGridRow = v3_table.querySelector(
          ".new_price_details_right .ptr-grid-row",
        );
        destroySwiper();
        let cc_discount = 0;
        const accountSizes = selectedBroker.account_size;
        const visibleSizes = accountSizes.filter(
          (acc) => acc.isVisible !== false,
        );
        if (visibleSizes.length === 0) {
          rightColGridRow.innerHTML = "";
          return;
        }
        const refSize = visibleSizes[0];

        let hasFunded =
          refSize.funded && Object.keys(refSize.funded).length > 0;
        let hasEval = refSize.evaluation && refSize.evaluation.length > 0;

        let rightHTML = "";
        const hasAnySelected = visibleSizes.some((acc) => acc.isSelected);
        visibleSizes.forEach((acc, index) => {
          let isSelected = acc.isSelected || (!hasAnySelected && index === 0);

          const disC = Number(getDiscountValue(acc.couponCode, "price"));
          cc_discount = disC;
          const prices = getCardPrices(acc, priceOptionSelections.get(acc), selectedPlan.labels);
          const save = prices.saving;
          const current_price = customRound(prices.sale);

          let colHTML = `<div class="prt-col-grid"><div class="prt-card-wrapper" ><div class="prt-card-shadow"></div><div class="prt-card-filpper">`;

          if (hasEval) {
            colHTML += `
  <div class="prt-card-faces front eval" aria-hidden="false"><div class="sheen"></div><div class="prt-col-grid-inner ${isSelected ? "selected" : ""}">
  <div class="prt-selected-border ${isSelected ? "active" : " "}"></div>
  <div class="prt-pp-tag ${isSelected ? "active" : " "}"><div class="prt-pp-tag-outer"><div class="prt-pp-tag-inner">MOST POPULAR</div></div></div>
  
  <div class="ptr-head">
  <img class="ptr-bg-img1" src="https://cdn.prod.website-files.com/6a1e68b17886472246c3aca3/6ab63629003b85ae1003b60b_pricing-card%20(1).webp" alt="background image">
  <img class="ptr-bg-img2" src="https://cdn.prod.website-files.com/6a1e68b17886472246c3aca3/6ab63d1428385fd73a522a15_Frame%202147239624.webp" alt="background image">
  <div class="ptr-row">
  <div class="prt-col">
  <div class="pt_hdr sm"><strong class="pt_hdr-big">${acc.name}</strong><span>${acc.evaluationName}</span></div>
  </div>
  </div>
  <div class="ptr-row">
    <div class="prt-col">
      <div class="prt-inline">
        <div class="new_price_prev" style="${save ? "display:block;" : "display:none;"}">
          <div>$${customRound(prices.list)}</div>
        </div>
        <div class="new_price_current">
          <div>$${current_price}</div>
        </div>
        <div class="ptr_price_tagline">${acc.subscription} payment</div>
      </div>
    </div>
  </div>
  </div>
  <div class="ptr-body">
  `;
            acc.evaluation.forEach((row, ii) => {
              const evalLabel = row[0];
              const evalTooltip = row[2]?.tooltip;
              colHTML += `
      <div class="ptr-row">
      <div class="prt-col prt-mob-col" data-rule-section="evaluation" data-rule-label="${escapeAttribute(evalLabel)}">
        <div class="prt-mob-label">${evalLabel} ${
          evalTooltip
            ? `<div class="tt_tip_wrp">
      <div class="tt_tip white">?</div>
      <div class="tt_top_box">
      <p class="mb-0">${evalTooltip}</p>
      </div>
      </div>`
            : ""
        }</div>
        <div class="prt-mob-data ${String(row[1]).toLowerCase() === "none" ? "tdfy-blue" : ""}">${row[1]}</div>
      </div>
      </div>`;
            });
            colHTML += `
    </div>
    <div class="ptr-foot">
    ${
      hasFunded
        ? `
    <div class="ptr-row">
    <div class="prt-col">
    <a href="#" class="flip_card_btn flip-to-back">View Funded Rules</a>
    </div>
    </div>`
        : ""
    }
    <div class="ptr-row">
    <div class="prt-col">
      <a data-onscreen-btnx="" data-react href="${btn_src}/?${acc.placementId}" class="tdfy-style-btn w-inline-block tdfy-price-btn price-btn">
      <div class="tdfy-style-outer-border left-br"></div>
      <div class="tdfy-style-outer-border right-br"></div>
      <div class="tdfy-style-border-right tdfy-style-border">
          <div class="tdfy-style-border-light"></div>
      </div>
      <div class="tdfy-style-border-left tdfy-style-border">
          <div class="tdfy-style-border-light"></div>
      </div>
      <div class="tdfy-style-absolute-box">
          <div class="tdfy-style-absolute-glow"></div>
      </div>
      <div class="tdfy-style-btn-box tdfy-price-btn-box">
          <div class="tdfy-style-text">
              <div>Start with ${acc.name}</div>
          </div>
      </div>
    </a>
    </div>
    </div>
    <div class="ptr-row" style="display:none;">
    <div class="prt-col pt-0">
     <div class="price_details_cp_tag" style="${save ? "opacity:1;" : "opacity:0;"}">
    <div>Save $${customRound(save)} with code ${getDiscountValue(acc.couponCode, "code")}</div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    `;
          }

          if (hasFunded) {
            colHTML += `
              <div class="prt-card-faces ${hasEval ? "back" : "front"} funded"  style="position:absolute; height:100%;" aria-hidden="${hasEval ? "true" : "false"}"><div class="sheen"></div><div class="prt-col-grid-inner ${isSelected ? "selected" : ""}">
              <div class="prt-selected-border ${isSelected ? "active" : " "}"></div>
              <div class="prt-pp-tag ${isSelected ? "active" : " "}"><div class="prt-pp-tag-outer"><div class="prt-pp-tag-inner">MOST POPULAR</div></div></div>
              <div class="ptr-head">
              <img class="ptr-bg-img1" src="https://cdn.prod.website-files.com/6a1e68b17886472246c3aca3/6ab63629003b85ae1003b60b_pricing-card%20(1).webp" alt="background image">
              <img class="ptr-bg-img2" src="https://cdn.prod.website-files.com/6a1e68b17886472246c3aca3/6ab63d1428385fd73a522a15_Frame%202147239624.webp" alt="background image">
  <div class="ptr-row">
  <div class="prt-col">
  <div class="pt_hdr sm"><strong class="pt_hdr-big">${acc.name}</strong><span>${acc.fundedName}</span></div>
  </div>
  </div>
  <div class="ptr-row">
  <div class="prt-col">
  <div class="prt-inline">
  <div class="new_price_prev" style="${save ? "display:block;" : "display:none;"}">
  <div>$${customRound(prices.list)}</div>
  </div>
  <div class="new_price_current">
  <div>$${current_price}</div>
  </div>
  <div class="ptr_price_tagline">${acc.subscription} payment</div>
  </div>
  </div>
  </div>
  </div>
  
  <div class="ptr-body">
  `;
            const fundedKeys = Object.keys(acc.funded);
            const isTwoRules = fundedKeys.length === 2;
            const baseRuleKey = fundedKeys[0];

            if (isTwoRules) {
              colHTML += `
    <div class="ptr-row">
    <div class="prt-col prt-mob-col two_rules">
      <div class="prt-mob-label">Chosen Path</div>
      <div class="prt-mob-data flex">
        <div class="prt-mob-data inline red">
          <div>Daily</div> 
          <img class="prt-data-img" src="https://cdn.prod.website-files.com/679b064a680c614548672a06/693048df7f661fd1e32a9f2a_image%2010%20(3).png" alt="Daily">
        </div>
        <div class="prt-mob-data inline blue">
          <div>Flex</div> 
          <img class="prt-data-img" src="https://cdn.prod.website-files.com/679b064a680c614548672a06/693048ecd29ecc9c8f2aed54_image%209%20(1).png" alt="Flex">
        </div>
      </div>
    </div>
    </div>`;
            }

            acc.funded[baseRuleKey].forEach((row, ii) => {
              const label = row[0];
              const tooltip = row[2]?.tooltip;
              const tooltipHTML = tooltip
                ? `<div class="tt_tip_wrp">
        <div class="tt_tip white">?</div>
        <div class="tt_top_box">
          <p class="mb-0">${tooltip}</p>
        </div>
      </div>`
                : "";

              let dataHTML = "";
              if (isTwoRules) {
                const val1 = row[1];
                const val2 = acc.funded[fundedKeys[1]][ii][1];
                dataHTML = `
          <div class="prt-mob-data flex">
            <div class="prt-mob-data inline ${String(val1).toLowerCase() === "none" ? "tdfy-blue" : ""}">${val1}</div>
            <div class="prt-mob-data inline ${String(val2).toLowerCase() === "none" ? "tdfy-blue" : ""}">${val2}</div>
          </div>`;
              } else {
                dataHTML = `<div class="prt-mob-data ${String(row[1]).toLowerCase() === "none" ? "tdfy-blue" : ""}">${row[1]}</div>`;
              }

              colHTML += `
    <div class="ptr-row">
    <div class="prt-col prt-mob-col ${isTwoRules ? "two_rules" : ""}" data-rule-section="funded" data-rule-label="${escapeAttribute(label)}">
      <div class="prt-mob-label">${label} ${tooltipHTML}</div>
      ${dataHTML}
    </div>
    </div>`;
            });
            colHTML += `
</div>
<div class="ptr-foot"> 
${
  hasEval
    ? `
<div class="ptr-row">
<div class="prt-col">
<a href="#" class="flip_card_btn flip-to-front">View Evaluation Rules</a>
</div>
</div>`
    : ""
}
<div class="ptr-row">
<div class="prt-col">
<a data-onscreen-btnx="" data-react href="${btn_src}/?${acc.placementId}" class="tdfy-style-btn w-inline-block tdfy-price-btn price-btn">
  <div class="tdfy-style-outer-border left-br"></div>
  <div class="tdfy-style-outer-border right-br"></div>
  <div class="tdfy-style-border-right tdfy-style-border">
      <div class="tdfy-style-border-light"></div>
  </div>
  <div class="tdfy-style-border-left tdfy-style-border">
      <div class="tdfy-style-border-light"></div>
  </div>
  <div class="tdfy-style-absolute-box">
      <div class="tdfy-style-absolute-glow"></div>
  </div>
  <div class="tdfy-style-btn-box tdfy-price-btn-box">
      <div class="tdfy-style-text">
           <div style="${hasEval ? "display:none;" : "display:block;"}">Get Funded with ${acc.name}</div>
          <div style="${hasEval ? "display:block;" : "display:none;"}">Start Evaluation</div>
      </div>
  </div>
</a>
</div>
</div>
<div class="ptr-row" style="display:none;">
<div class="prt-col pt-0">
  <div class="price_details_cp_tag" style="${save ? "opacity:1;" : "opacity:0;"}">
<div>Save $${customRound(save)} with code ${getDiscountValue(acc.couponCode, "code")}</div>
</div>
</div>
</div> 
</div>
</div>
</div>
`;
          }

          colHTML += `</div><div class="prt-card-edge"></div></div></div>`;
          rightHTML += colHTML;
        });

        rightColGridRow.innerHTML = rightHTML;
        initPricingOptions(selectedPlan, visibleSizes, rightColGridRow);

        class CardFlipper {
          constructor(wrapper) {
            this.wrapper = wrapper;
            this.flipper = wrapper.querySelector(".prt-card-filpper");
            this.shadow = wrapper.querySelector(".prt-card-shadow");
            this.edge = wrapper.querySelector(".prt-card-edge");
            this.front = wrapper.querySelector(".prt-card-faces.front");
            this.back = wrapper.querySelector(".prt-card-faces.back");
            this.toBack = wrapper.querySelector(".flip-to-back");
            this.toFront = wrapper.querySelector(".flip-to-front");
            if (this.back) this.back.inert = true;

            this.reduced = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;
            this.MAX_LIFT = 115;
            this.STIFFNESS = 128;
            this.DAMPING = 21.25;
            this.MASS = 1.65;

            this.angle = 0;
            this.vel = 0;
            this.target = 0;
            this.raf = null;
            this.last = null;

            this.step = this.step.bind(this);
            this.render = this.render.bind(this);

            this.render();
          }

          render() {
            const rad = (this.angle * Math.PI) / 180;
            const s = Math.abs(Math.sin(rad));
            const lift = s * this.MAX_LIFT;

            if (this.flipper) {
              this.flipper.style.transform = `translateY(${(-s * 18).toFixed(2)}px) translateZ(${lift.toFixed(2)}px) rotateY(${this.angle.toFixed(2)}deg)`;
              this.flipper.style.setProperty(
                "--sheen",
                Math.pow(s, 1.4).toFixed(3),
              );
              this.flipper.style.setProperty(
                "--sheen-x",
                (50 + Math.sin(rad) * 70).toFixed(1) + "%",
              );
            }

            if (this.shadow) {
              this.shadow.style.transform = `translateX(-50%) translateY(${(s * 30).toFixed(1)}px) scale(${(1 + s * 0.26).toFixed(3)})`;
              this.shadow.style.opacity = (0.5 - s * 0.34).toFixed(3);
            }

            if (this.edge) {
              this.edge.style.opacity = (Math.pow(s, 11) * 0.9).toFixed(3);
            }
          }

          step(t) {
            if (this.last == null) this.last = t;
            let dt = (t - this.last) / 1000;
            this.last = t;
            if (dt > 0.05) dt = 0.05;

            const sub = 6;
            const sdt = dt / sub;
            for (let i = 0; i < sub; i++) {
              const force =
                -this.STIFFNESS * (this.angle - this.target) -
                this.DAMPING * this.vel;
              this.vel += (force / this.MASS) * sdt;
              this.angle += this.vel * sdt;
            }

            this.render();

            if (
              Math.abs(this.angle - this.target) < 0.08 &&
              Math.abs(this.vel) < 0.6
            ) {
              this.angle = this.target;
              this.vel = 0;
              this.render();
              this.raf = null;
              this.last = null;
              return;
            }
            this.raf = requestAnimationFrame(this.step);
          }

          setFlipped(toBackSide) {
            this.target = toBackSide ? 180 : 0;

            if (this.front && this.back && this.toBack && this.toFront) {
              this.front.setAttribute("aria-hidden", String(toBackSide));
              this.back.setAttribute("aria-hidden", String(!toBackSide));
              this.front.inert = toBackSide;
              this.back.inert = !toBackSide;
            }

            if (this.reduced) {
              this.angle = this.target;
              this.vel = 0;
              this.render();
              return;
            }
            if (!this.raf) {
              this.last = null;
              this.raf = requestAnimationFrame(this.step);
            }
          }
        }

        const flippers = new Map();
        rightColGridRow
          .querySelectorAll(".prt-card-wrapper")
          .forEach((wrapper) => {
            flippers.set(wrapper, new CardFlipper(wrapper));
          });

        rightColGridRow.querySelectorAll(".flip-to-back").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            const wrapper = e.target.closest(".prt-card-wrapper");
            const flipperObj = flippers.get(wrapper);
            if (flipperObj) flipperObj.setFlipped(true);
          });
        });

        rightColGridRow.querySelectorAll(".flip-to-front").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            const wrapper = e.target.closest(".prt-card-wrapper");
            const flipperObj = flippers.get(wrapper);
            if (flipperObj) flipperObj.setFlipped(false);
          });
        });

        function matchCardHeights() {
          const wrappers = v3_table.querySelectorAll(".prt-card-wrapper");
          if (!wrappers.length) return;

          wrappers.forEach((w) => {
            w.style.height = "";
          });

          let absoluteMax = 0;

          wrappers.forEach((wrapper) => {
            const faces = wrapper.querySelectorAll(".prt-card-faces");
            let wrapperMax = 0;
            faces.forEach((face) => {
              const oldPos = face.style.position;
              const oldHeight = face.style.height;

              face.style.position = "relative";
              face.style.height = "auto";

              const h = face.offsetHeight;

              face.style.position = oldPos;
              face.style.height = oldHeight;

              if (h > wrapperMax) wrapperMax = h;
            });
            if (wrapperMax > absoluteMax) absoluteMax = wrapperMax;
          });

          if (absoluteMax > 0) {
            wrappers.forEach((wrapper) => {
              wrapper.style.height = absoluteMax + "px";
            });
          }
        }

        resizeCardHeights = matchCardHeights;
        setTimeout(() => {
          matchCardHeights();
        }, 100);

        const evMsgTab = pr_container.querySelector(".ev_msg");
        if (evMsgTab) {
          if (!hasEval) {
            evMsgTab.style.display = "block";
          } else {
            evMsgTab.style.display = "none";
          }
        }

        setTimeout(() => {
          // const url_param = paramCheck();
          v3_table.classList.add("loaded");

          const btns = pr_container.querySelectorAll(".tdfy-price-btn");
          if (btns.length) {
            btns.forEach((btn) => {
              btn.href = window.carryForwardParams(btn.getAttribute("href"));

              const glow = btn.querySelector(".tdfy-style-absolute-box"),
                borderLeft = btn.querySelector(".tdfy-style-border-left"),
                borderRight = btn.querySelector(".tdfy-style-border-right"),
                btn_txt = btn.querySelector(".tdfy-style-btn-box"),
                lft_br = btn.querySelector(".tdfy-style-outer-border.left-br"),
                rt_br = btn.querySelector(".tdfy-style-outer-border.right-br");

              let x_val = 0;
              function updateXVal() {
                const styles = getComputedStyle(btn_txt);
                x_val =
                  (btn.clientWidth -
                    (parseFloat(styles.paddingLeft) +
                      parseFloat(styles.paddingRight))) /
                  2;
              }
              updateXVal();
              glow.style.transform = `translateX(${x_val}px) translateZ(0px)`;
              borderLeft.style.opacity = 0;
              borderRight.style.opacity = 1;
              lft_br.style.opacity = 0;
              rt_br.style.opacity = 1;

              let resetTimeout = null,
                debounceTimer = null;
              const DEBOUNCE_DELAY = 5,
                DEBOUNCE_TIME = 1000;

              function handleMouseMove(e) {
                const rect = btn.getBoundingClientRect();
                let x = e.clientX - rect.left;
                x = Math.max(0, Math.min(x, rect.width));
                // Normalize 0 → 1
                const progress = x / rect.width;
                const glowX = (progress - 0.5) * 2 * x_val;
                glow.style.transform = `translateX(${glowX}px) translateZ(0)`;
                borderLeft.style.opacity = Math.max(0, 1 - progress * 2);
                borderRight.style.opacity = Math.max(0, (progress - 0.5) * 2);
                lft_br.style.opacity = Math.max(0, 1 - progress * 2);
                rt_br.style.opacity = Math.max(0, (progress - 0.5) * 2);
              }

              // if (url_param != null && url_param.code != null) {
              //   if (!url_param.isURL) {
              //     btn.addEventListener("click", (e) => {
              //       e.preventDefault();
              //       window.location.href = addRefToUrl(
              //         btn.getAttribute("href"),
              //         url_param.code,
              //       );
              //     });
              //   } else {
              //     btn.setAttribute(
              //       "href",
              //       addRefToUrl(btn.getAttribute("href"), url_param.code),
              //     );
              //   }
              // }

              btn.addEventListener("mousemove", (e) => {
                updateXVal();
                if (resetTimeout) {
                  clearTimeout(resetTimeout);
                  resetTimeout = null;
                }
                if (debounceTimer) return;
                debounceTimer = setTimeout(() => {
                  handleMouseMove(e);
                  debounceTimer = null;
                }, DEBOUNCE_DELAY);
              });

              btn.addEventListener("mouseleave", () => {
                updateXVal();
                if (debounceTimer) {
                  clearTimeout(debounceTimer);
                  debounceTimer = null;
                }
                resetTimeout = setTimeout(() => {
                  glow.style.transform = `translateX(${x_val}px) translateZ(0)`;
                  borderLeft.style.opacity = 0;
                  borderRight.style.opacity = 1;
                  lft_br.style.opacity = 0;
                  rt_br.style.opacity = 1;
                }, DEBOUNCE_TIME);
              });
            });
          }
        }, 300);
        // Initial card slider
        initMobileSlider();
        setTimeout(() => {
          initMobileSlider();
        }, 300);
      }
    }

    init();
    createTable();
  }
}

// Re-init when page is restored from bfcache (browser back button)
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    price_table();
  }
});
document.addEventListener("DOMContentLoaded", price_table);
