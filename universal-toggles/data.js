 
// Plan option placementId: extra checkout parameters (e.g. "plan_addon_daily_loss=true").
// Selected options are combined; the account placementId stays unchanged. Blank adds nothing.
/*  1-Step Daily Sections */
const oneStepDailyData = [
  {
    name: "one_step_daily",
    labels: ["daily_loss", "consistency", "leverage"],
    pricingOptions: [
      {
        name: "daily loss",
        target: "evaluation",
        value: [["None", "3%"], [null, 3]],
        placementId: "plan_addon_daily_loss=true",
      },
      {
        name: "consistency",
        target: "evaluation",
        value: [["None", "50%"], [null, 50]],
        placementId: "plan_addon_consistency=true",
      },
      {
        name: "leverage",
        target: "evaluation",
        value: [["1:20", "1:40"], [20, 40]],
        placementId: "plan_addon_leverage=true",
      },
    ],
    isSelected: false,
    isVisible: true,
    broker: [
      {
        broker_name: "metaTrader5",
        isSelected: true,
        isVisible: true,
        account_size: [
          {
            name: "10K",
            isSelected: false,
            isVisible: true,
            price: 114,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 114,
                "0-1": 104,
                "1-0": 62,
                "1-1": 50,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "one_step_daily",
            placementId: "plan=daily-10k-mt5",
            tooltip: "",
            evaluationName: "Daily",
            fundedName: "Sim Funded",
            evaluation: [
              ["Profit Target", "$1,000", { tooltip: "" }],
              ["Daily Loss", "None", { tooltip: "" }],
              ["Max Loss", "$500", { tooltip: "" }],
              ["Consistency", "40% eval only", { tooltip: "" }],
              ["Leverage", "Up to 1:100 FX", { tooltip: "" }],
              ["Profit Split", "80%", { tooltip: "" }],
              ["Payout Frequency", "Daily (3% cap)", { tooltip: "" }],
            ],
            funded: {
              rule1: [
                ["Daily Loss Limit", "None", { tooltip: "" }],
                ["Max Loss", "$500", { tooltip: "" }],
                ["Consistency", "None", { tooltip: "" }],
                // ["Minimum Days", "5", { tooltip: "" }],
                // ["News Trading", "Allowed", { tooltip: "" }],
                [
                  "Buffer",
                  "4%",
                  {
                    tooltip:
                      "Daily payouts come from profit above a 4% buffer, which stays in your account. Maximum 3% of the account size per payout.",
                  },
                ],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "Daily (3% cap)", { tooltip: "" }],
                // ["Payout Lock", "No", { tooltip: "" }],
              ],
            },
          },
          {
            name: "25K",
            isSelected: true,
            isVisible: true,
            price: 335,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 335,
                "0-1": 293,
                "1-0": 177,
                "1-1": 152,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "one_step_daily",
            placementId: "plan=daily-25k-mt5",
            tooltip: "",
            evaluationName: "Daily",
            fundedName: "Sim Funded",
            evaluation: [
              ["Profit Target", "$2,500", { tooltip: "" }],
              ["Daily Loss", "None", { tooltip: "" }],
              ["Max Loss", "$1,250", { tooltip: "" }],
              ["Consistency", "40% eval only", { tooltip: "" }],
              ["Leverage", "Up to 1:100 FX", { tooltip: "" }],
              ["Profit Split", "80%", { tooltip: "" }],
              ["Payout Frequency", "Daily (3% cap)", { tooltip: "" }],
            ],
            funded: {
              rule1: [
                ["Daily Loss Limit", "None", { tooltip: "" }],
                ["Max Loss", "$1,250", { tooltip: "" }],
                ["Consistency", "None", { tooltip: "" }],
                // ["Minimum Days", "5", { tooltip: "" }],
                // ["News Trading", "Allowed", { tooltip: "" }],
                [
                  "Buffer",
                  "4%",
                  {
                    tooltip:
                      "Daily payouts come from profit above a 4% buffer, which stays in your account. Maximum 3% of the account size per payout.",
                  },
                ],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "Daily (3% cap)", { tooltip: "" }],
                // ["Payout Lock", "No", { tooltip: "" }],
              ],
            },
          },
          {
            name: "50K",
            isSelected: false,
            isVisible: true,
            price: 755,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 755,
                "0-1": 660,
                "1-0": 392,
                "1-1": 329,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "one_step_daily",
            placementId: "plan=daily-50k-mt5",
            tooltip: "",
            evaluationName: "Daily",
            fundedName: "Sim Funded",
            evaluation: [
              ["Profit Target", "$5,000", { tooltip: "" }],
              ["Daily Loss", "None", { tooltip: "" }],
              ["Max Loss", "$2,500", { tooltip: "" }],
              ["Consistency", "40% eval only", { tooltip: "" }],
              ["Leverage", "Up to 1:100 FX", { tooltip: "" }],
              ["Profit Split", "80%", { tooltip: "" }],
              ["Payout Frequency", "Daily (3% cap)", { tooltip: "" }],
            ],
            funded: {
              rule1: [
                ["Daily Loss Limit", "None", { tooltip: "" }],
                ["Max Loss", "$2,500", { tooltip: "" }],
                ["Consistency", "None", { tooltip: "" }],
                // ["Minimum Days", "5", { tooltip: "" }],
                // ["News Trading", "Allowed", { tooltip: "" }],
                [
                  "Buffer",
                  "4%",
                  {
                    tooltip:
                      "Daily payouts come from profit above a 4% buffer, which stays in your account. Maximum 3% of the account size per payout.",
                  },
                ],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "Daily (3% cap)", { tooltip: "" }],
                // ["Payout Lock", "No", { tooltip: "" }],
              ],
            },
          },
          {
            name: "100K",
            isSelected: false,
            isVisible: true,
            price: 429,
            subscription: "one time",
            couponCode: "one_step_daily",
            placementId: "plan=daily-100k-mt5",
            tooltip: "",
            evaluationName: "Daily",
            fundedName: "Sim Funded",
            pricingOptions: [
              {
                combination: [
                  [[1], 1.25],
                  [[2], 2.25],
                  [[1, 2], -3.5],
                ],
              },
              {
                combination: [
                  [[0], 2.75],
                  [[2], -2.75],
                  [[0, 2], -1],
                ],
              },
              {
                combination: [
                  [[0], 4.25],
                  [[1], -3.25],
                  [[0, 1], 1.5],
                ],
              },
            ],
            evaluation: [
              ["Profit Target", "$10,000", { tooltip: "" }],
              ["Daily Loss", "None", { tooltip: "" }],
              ["Max Loss", "$5,000", { tooltip: "" }],
              ["Consistency", "40% eval only", { tooltip: "" }],
              ["Leverage", "Up to 1:100 FX", { tooltip: "" }],
              ["Profit Split", "80%", { tooltip: "" }],
              ["Payout Frequency", "Daily (3% cap)", { tooltip: "" }],
            ],
            funded: {
              rule1: [
                ["Daily Loss Limit", "None", { tooltip: "" }],
                ["Max Loss", "$5,000", { tooltip: "" }],
                ["Consistency", "None", { tooltip: "" }],
                // ["Minimum Days", "5", { tooltip: "" }],
                // ["News Trading", "Allowed", { tooltip: "" }],
                [
                  "Buffer",
                  "4%",
                  {
                    tooltip:
                      "Daily payouts come from profit above a 4% buffer, which stays in your account. Maximum 3% of the account size per payout.",
                  },
                ],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "Daily (3% cap)", { tooltip: "" }],
                // ["Payout Lock", "No", { tooltip: "" }],
              ],
            },
          },
        ],
      },
    ],
  },
];

/* 2 step clasic Sections  */
const twoStepClassicData = [
  {
    name: "two_step_classic",
    labels: ["daily_loss", "consistency", "leverage"],
    pricingOptions: [
      {
        name: "daily loss",
        target: "evaluation",
        value: [["None", "3%"], [null, 3]],
        placementId: "plan_addon_daily_loss=true",
      },
      {
        name: "consistency",
        target: "evaluation",
        value: [["None", "50%"], [null, 50]],
        placementId: "plan_addon_consistency=true",
      },
      {
        name: "leverage",
        target: "evaluation",
        value: [["1:20", "1:40"], [20, 40]],
        placementId: "plan_addon_leverage=true",
      },
    ],
    isSelected: true,
    isVisible: true,
    broker: [
      {
        broker_name: "metaTrader5",
        isSelected: true,
        isVisible: true,
        account_size: [
          {
            name: "5K",
            isSelected: false,
            isVisible: true,
            price: 51,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 51,
                "0-1": 47,
                "1-0": 28,
                "1-1": 24,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "two_step_classic",
            placementId: "plan=classic-5k-mt5",
            tooltip: "",
            evaluationName: "Classic",
            fundedName: "Sim Funded",
            evaluation: [
              ["Profit Target", "$250 → $500", { tooltip: "" }],
              ["Daily Loss", "$150", { tooltip: "" }],
              ["Max Loss (Static)", "$500", { tooltip: "" }],
              ["Consistency", "None", { tooltip: "" }],
              ["Leverage", "Up to 1:100 FX", { tooltip: "" }],
              ["Profit Split", "80%", { tooltip: "" }],
              ["Payout Frequency", "Biweekly", { tooltip: "" }],
            ],
            funded: {
              rule1: [
                ["Daily Loss Limit", "$150", { tooltip: "" }],
                ["Max Loss (Static)", "$500", { tooltip: "" }],
                ["Consistency", "None", { tooltip: "" }],
                // ["Minimum Days", "5", { tooltip: "" }],
                // ["News Trading", "Allowed", { tooltip: "" }],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "Biweekly", { tooltip: "" }],
                // ["Payout Lock", "No", { tooltip: "" }],
              ],
            },
          },
          {
            name: "10K",
            isSelected: false,
            isVisible: true,
            price: 114,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 114,
                "0-1": 104,
                "1-0": 62,
                "1-1": 50,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "two_step_classic",
            placementId: "plan=classic-10k-mt5",
            tooltip: "",
            evaluationName: "Classic",
            fundedName: "Sim Funded",
            evaluation: [
              ["Profit Target", "$500 → $1,000", { tooltip: "" }],
              [
                "Daily Loss",
                "<span class='tdfy-blue'>$300</span>",
                { tooltip: "" },
              ],
              ["Max Loss (Static)", "$1,000", { tooltip: "" }],
              ["Consistency", "None", { tooltip: "" }],
              ["Leverage", "Up to 1:100 FX", { tooltip: "" }],
              ["Profit Split", "80%", { tooltip: "" }],
              ["Payout Frequency", "Biweekly", { tooltip: "" }],
            ],
            funded: {
              rule1: [
                ["Daily Loss Limit", "$300", { tooltip: "" }],
                ["Max Loss (Static)", "$1,000", { tooltip: "" }],
                ["Consistency", "None", { tooltip: "" }],
                // ["Minimum Days", "5", { tooltip: "" }],
                // ["News Trading", "Allowed", { tooltip: "" }],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "Biweekly", { tooltip: "" }],
                // ["Payout Lock", "No", { tooltip: "" }],
              ],
            },
          },
          {
            name: "25K",
            isSelected: true,
            isVisible: true,
            price: 335,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 335,
                "0-1": 293,
                "1-0": 177,
                "1-1": 152,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "two_step_classic",
            placementId: "plan=classic-25k-mt5",
            tooltip: "",
            evaluationName: "Classic",
            fundedName: "Sim Funded",
            evaluation: [
              ["Profit Target", "$1,250 → $2,500", { tooltip: "" }],
              [
                "Daily Loss",
                "<span class='tdfy-blue'>$750</span>",
                { tooltip: "" },
              ],
              ["Max Loss (Static)", "$2,500", { tooltip: "" }],
              ["Consistency", "None", { tooltip: "" }],
              ["Leverage", "Up to 1:100 FX", { tooltip: "" }],
              ["Profit Split", "80%", { tooltip: "" }],
              ["Payout Frequency", "Biweekly", { tooltip: "" }],
            ],
            funded: {
              rule1: [
                ["Daily Loss Limit", "$750", { tooltip: "" }],
                ["Max Loss (Static)", "$2,500", { tooltip: "" }],
                ["Consistency", "None", { tooltip: "" }],
                // ["Minimum Days", "5", { tooltip: "" }],
                // ["News Trading", "Allowed", { tooltip: "" }],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "Biweekly", { tooltip: "" }],
                // ["Payout Lock", "No", { tooltip: "" }],
              ],
            },
          },
          {
            name: "50K",
            isSelected: false,
            isVisible: true,
            price: 755,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 755,
                "0-1": 660,
                "1-0": 392,
                "1-1": 329,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "two_step_classic",
            placementId: "plan=classic-50k-mt5",
            tooltip: "",
            evaluationName: "Classic",
            fundedName: "Sim Funded",
            evaluation: [
              ["Profit Target", "$2,500 → $5,000", { tooltip: "" }],
              [
                "Daily Loss",
                "<span class='tdfy-blue'>$1,500</span>",
                { tooltip: "" },
              ],
              ["Max Loss (Static)", "$5,000", { tooltip: "" }],
              ["Consistency", "None", { tooltip: "" }],
              ["Leverage", "Up to 1:100 FX", { tooltip: "" }],
              ["Profit Split", "80%", { tooltip: "" }],
              ["Payout Frequency", "Biweekly", { tooltip: "" }],
            ],
            funded: {
              rule1: [
                ["Daily Loss Limit", "$1,500", { tooltip: "" }],
                ["Max Loss (Static)", "$5,000", { tooltip: "" }],
                ["Consistency", "None", { tooltip: "" }],
                // ["Minimum Days", "5", { tooltip: "" }],
                // ["News Trading", "Allowed", { tooltip: "" }],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "Biweekly", { tooltip: "" }],
                // ["Payout Lock", "No", { tooltip: "" }],
              ],
            },
          },
          {
            name: "100K",
            isSelected: false,
            isVisible: true,
            price: 749,
            subscription: "one time",
            couponCode: "two_step_classic",
            placementId: "plan=classic-100k-mt5",
            tooltip: "",
            evaluationName: "Classic",
            fundedName: "Sim Funded",
            pricingOptions: [
              {
                combination: [
                  [[1], 1.75],
                  [[2], 4.5],
                  [[1, 2], 1],
                ],
              },
              {
                combination: [
                  [[0], 4],
                  [[2], 5],
                  [[0, 2], -2],
                ],
              },
              {
                combination: [
                  [[0], 3.25],
                  [[1], 0.5],
                  [[0, 1], 3],
                ],
              },
            ],
            evaluation: [
              ["Profit Target", "$5,000 → $10,000", { tooltip: "" }],
              [
                "Daily Loss",
                "<span class='tdfy-blue'>$3,000</span>",
                { tooltip: "" },
              ],
              ["Max Loss (Static)", "$10,000", { tooltip: "" }],
              ["Consistency", "None", { tooltip: "" }],
              ["Leverage", "Up to 1:100 FX", { tooltip: "" }],
              ["Profit Split", "80%", { tooltip: "" }],
              ["Payout Frequency", "Biweekly", { tooltip: "" }],
            ],
            funded: {
              rule1: [
                ["Daily Loss Limit", "$3,000", { tooltip: "" }],
                ["Max Loss (Static)", "$10,000", { tooltip: "" }],
                ["Consistency", "None", { tooltip: "" }],
                // ["Minimum Days", "5", { tooltip: "" }],
                // ["News Trading", "Allowed", { tooltip: "" }],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "Biweekly", { tooltip: "" }],
                // ["Payout Lock", "No", { tooltip: "" }],
              ],
            },
          },
        ],
      },
    ],
  },
];

/* Direct Sections  */
const DirectData = [
  {
    name: "direct",
    labels: ["daily_loss", "consistency", "leverage"],
    pricingOptions: [
      {
        name: "daily loss",
        target: "evaluation",
        value: [["None", "3%"], [null, 3]],
        placementId: "plan_addon_daily_loss=true",
      },
      {
        name: "consistency",
        target: "evaluation",
        value: [["None", "50%"], [null, 50]],
        placementId: "plan_addon_consistency=true",
      },
      {
        name: "leverage",
        target: "evaluation",
        value: [["1:20", "1:40"], [20, 40]],
        placementId: "plan_addon_leverage=true",
      },
    ],
    isSelected: false,
    isVisible: true,
    broker: [
      {
        broker_name: "metaTrader5",
        isSelected: true,
        isVisible: true,
        account_size: [
          {
            name: "5K",
            isSelected: false,
            isVisible: true,
            price: 51,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 51,
                "0-1": 47,
                "1-0": 28,
                "1-1": 24,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "direct",
            placementId: "plan=direct-5k-mt5",
            tooltip: "",
            evaluationName: "",
            fundedName: "Direct",
            evaluation: [],
            funded: {
              rule1: [
                ["Daily Loss Limit", "$150", { tooltip: "" }],
                ["Max Loss", "$300", { tooltip: "" }],
                ["Consistency", "20%", { tooltip: "" }],
                // [
                //   "News Trading",
                //   "<span class='tdfy-blue'>Allowed</span>",
                //   { tooltip: "" },
                // ],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "On demand", { tooltip: "" }],
                ["Payout Lock", "Yes", { tooltip: "" }],
              ],
            },
          },
          {
            name: "10K",
            isSelected: false,
            isVisible: true,
            price: 114,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 114,
                "0-1": 104,
                "1-0": 62,
                "1-1": 50,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "direct",
            placementId: "plan=direct-10k-mt5",
            tooltip: "",
            evaluationName: "",
            fundedName: "Direct",
            evaluation: [],
            funded: {
              rule1: [
                ["Daily Loss Limit", "$300", { tooltip: "" }],
                ["Max Loss", "$600", { tooltip: "" }],
                ["Consistency", "20%", { tooltip: "" }],
                // [
                //   "News Trading",
                //   "<span class='tdfy-blue'>Allowed</span>",
                //   { tooltip: "" },
                // ],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "On demand", { tooltip: "" }],
                ["Payout Lock", "Yes", { tooltip: "" }],
              ],
            },
          },
          {
            name: "25K",
            isSelected: false,
            isVisible: true,
            price: 335,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 335,
                "0-1": 293,
                "1-0": 177,
                "1-1": 152,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "direct",
            placementId: "plan=direct-25k-mt5",
            tooltip: "",
            evaluationName: "",
            fundedName: "Direct",
            evaluation: [],
            funded: {
              rule1: [
                ["Daily Loss Limit", "$750", { tooltip: "" }],
                ["Max Loss", "$1,500", { tooltip: "" }],
                ["Consistency", "20%", { tooltip: "" }],
                // [
                //   "News Trading",
                //   "<span class='tdfy-blue'>Allowed</span>",
                //   { tooltip: "" },
                // ],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "On demand", { tooltip: "" }],
                ["Payout Lock", "Yes", { tooltip: "" }],
              ],
            },
          },
          {
            name: "50K",
            isSelected: false,
            isVisible: true,
            price: 755,
            // Final prices keyed by daily_loss-consistency (0 = default, 1 = selected).
            pricing: {
              combinations: {
                "0-0": 755,
                "0-1": 660,
                "1-0": 392,
                "1-1": 329,
              },
              boostPercent: 20,
            },
            subscription: "one time",
            couponCode: "direct",
            placementId: "plan=direct-50k-mt5",
            tooltip: "",
            evaluationName: "",
            fundedName: "Direct",
            evaluation: [],
            funded: {
              rule1: [
                ["Daily Loss Limit", "$1,500", { tooltip: "" }],
                ["Max Loss", "$3,000", { tooltip: "" }],
                ["Consistency", "20%", { tooltip: "" }],
                // [
                //   "News Trading",
                //   "<span class='tdfy-blue'>Allowed</span>",
                //   { tooltip: "" },
                // ],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "On demand", { tooltip: "" }],
                ["Payout Lock", "Yes", { tooltip: "" }],
              ],
            },
          },
          {
            name: "100K",
            isSelected: true,
            isVisible: true,
            price: 999,
            subscription: "one time",
            couponCode: "direct",
            placementId: "plan=direct-100k-mt5",
            tooltip: "",
            evaluationName: "",
            fundedName: "Direct",
            pricingOptions: [
              {
                combination: [
                  [[1], 5.75],
                  [[2], -3.25],
                  [[1, 2], -2.25],
                ],
              },
              {
                combination: [
                  [[0], -1.75],
                  [[2], 2.5],
                  [[0, 2], -1.5],
                ],
              },
              {
                combination: [
                  [[0], 1],
                  [[1], -1.25],
                  [[0, 1], -0.25],
                ],
              },
            ],
            evaluation: [],
            funded: {
              rule1: [
                ["Daily Loss Limit", "$3,000", { tooltip: "" }],
                ["Max Loss", "$6,000", { tooltip: "" }],
                ["Consistency", "20%", { tooltip: "" }],
                // [
                //   "News Trading",
                //   "<span class='tdfy-blue'>Allowed</span>",
                //   { tooltip: "" },
                // ],
                ["Profit Split", "80%", { tooltip: "" }],
                ["Payout Frequency", "On demand", { tooltip: "" }],
                ["Payout Lock", "Yes", { tooltip: "" }],
              ],
            },
          },
        ],
      },
    ],
  },
];

const btn_src = "https://checkout.tradeifyfx.co"; //base URL

/* coupon code with discount */
const couponDetails = {
  default_code: ["OCT", 35],
  one_step_daily: ["OCT", 35],
  two_step_classic: ["OCT", 35],
  direct: ["OCT", 35],
  button: ["normal", 35],

  special: ["SP", 35],
  none: ["none", 0],
};

const priceData = [...oneStepDailyData, ...twoStepClassicData, ...DirectData];
