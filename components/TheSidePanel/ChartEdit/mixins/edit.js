import cloneDeep from 'lodash/cloneDeep';

export default {
  props: {
    currentChartOption: {
      type: Object,
      default: null,
    },

    currentChartLayout: {
      type: Object,
      default: null,
    },

    configKeyRange: {
      type: Array,
      required: true,
    },

    onOptionChange: {
      type: Function,
      required: true,
    },
  },

  watch: {
    'currentChartLayout.i'(val) {
      if (val) {
        this.initFormData();
      }
    },
  },

  created() {
    this.initFormData();

    this.$watch(
      'formData',
      function (val) {
        this.onOptionChange(this.formData);
      },
      { deep: true }
    );
  },

  methods: {
    initFormData() {
      const currentChartOption = cloneDeep(this.currentChartOption);
      this.configKeyRange.forEach((key) => {
        if (key in currentChartOption) {
          this.$set(this.form.data, key, currentChartOption[key]);
        }
      });
      this.form.defaultData = cloneDeep(this.form.data);
    },
  },
};
