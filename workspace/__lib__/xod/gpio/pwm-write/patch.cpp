#pragma XOD evaluate_on_pin disable
#pragma XOD evaluate_on_pin enable input_UPD
#pragma XOD error_raise enable

struct State {
};

{{ GENERATED_CODE }}

#ifdef PWMRANGE
constexpr Number pwmRange = PWMRANGE;
#else
constexpr Number pwmRange = 255.0;
#endif

void evaluate(Context ctx) {
    if (!isInputDirty<input_UPD>(ctx))
        return;

    const uint8_t port = getValue<input_PORT>(ctx);

    if (!isValidDigitalPort(port)) {
        raiseError(ctx);
        return;
    }

    auto duty = getValue<input_DUTY>(ctx);
    duty = duty > 1 ? 1 : (duty < 0 ? 0 : duty);
    int val = (int)(duty * pwmRange);

    ::pinMode(port, OUTPUT);
    ::analogWrite(port, val);
    emitValue<output_DONE>(ctx, 1);
}
