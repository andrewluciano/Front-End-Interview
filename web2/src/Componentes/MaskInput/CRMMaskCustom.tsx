import { type Ref, forwardRef } from "react";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";

interface CRMMaskProps {
  name?: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
}

export const CRMMaskCustom = forwardRef<HTMLInputElement, CRMMaskProps>(
  (props, ref) => {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        style={{ textTransform: "uppercase" }}
        mask="CRM-** 000000000" // Brazilian phone mask
        definitions={{
          "0": /[0-9]/,
        }}
        inputRef={ref as Ref<HTMLInputElement>}
        lazy={false}
        onAccept={(value) => onChange({ target: { name: props.name!, value } })}
        overwrite
      />
    );
  },
);

CRMMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
