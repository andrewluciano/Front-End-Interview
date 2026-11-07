import { type Ref, forwardRef } from "react";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";

interface CEPMaskProps {
  name?: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
}

export const CEPMaskCustom = forwardRef<HTMLInputElement, CEPMaskProps>(
  (props, ref) => {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00000-000" // Brazilian phone mask
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

CEPMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
