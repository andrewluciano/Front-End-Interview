import { type Ref, forwardRef } from "react";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";

interface PhoneMaskProps {
  name?: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
}

export const PhoneMaskCustom = forwardRef<HTMLInputElement, PhoneMaskProps>(
  (props, ref) => {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="(00) 00000-0000" // Brazilian phone mask
        definitions={{
          "0": /[0-9]/,
        }}
        inputRef={ref as Ref<HTMLInputElement>}
        onAccept={(value) => onChange({ target: { name: props.name!, value } })}
        overwrite
      />
    );
  },
);

PhoneMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
