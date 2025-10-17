from pyteal import *


def approval_program() -> Expr:
    owner_key = Bytes("owner")

    on_create = Seq(
        App.globalPut(owner_key, Txn.sender()),
        Approve(),
    )

    is_owner = Txn.sender() == App.globalGet(owner_key)

    on_update = Reject()
    on_delete = If(is_owner, Approve(), Reject())

    on_opt_in = Approve()
    on_close_out = Approve()

    handle_noop = Approve()

    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.UpdateApplication, on_update],
        [Txn.on_completion() == OnComplete.DeleteApplication, on_delete],
        [Txn.on_completion() == OnComplete.OptIn, on_opt_in],
        [Txn.on_completion() == OnComplete.CloseOut, on_close_out],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop],
    )

    return program


def clear_state_program() -> Expr:
    return Approve()


if __name__ == "__main__":
    from pyteal import compileTeal, Mode

    print(compileTeal(approval_program(), mode=Mode.Application, version=8))
    print(compileTeal(clear_state_program(), mode=Mode.Application, version=8))


