struct State {
};

{{ GENERATED_CODE }}

void evaluate(NodeId nid, State* state) {
    auto x = getValue<Inputs::X>(nid);
    emitValue<Outputs::FLR>(nid, floor(x));
}