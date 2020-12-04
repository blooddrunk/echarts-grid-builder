// must be used with withForm
export default {
  computed: {
    validationEnabled() {
      return !!this.$validator;
    },

    isFormDirty() {
      if (this.formFields) {
        return Object.keys(this.formFields).some((key) => this.formFields[key].dirty);
      }

      return false;
    },
  },

  methods: {
    async validateForm() {
      const valid = await this.$validator.validate();
      if (!valid) {
        const validationError = new Error('请检查您填写的内容');
        const form = this[this.computedNamespace];
        if (form) {
          form.validationError = validationError;
        }
        throw validationError;
      }
    },

    collectFirstError() {
      if (this.formErrors) {
        const errors = this.formErrors.collect();
        const errorFields = Object.keys(errors);
        if (!errorFields || !errorFields.length) {
          return null;
        }

        const firstField = errorFields[0];
        return {
          field: firstField,
          error: errors[firstField][0],
        };
      }

      return null;
    },
  },
};
