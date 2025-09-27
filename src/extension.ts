import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('nl2code.generate', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const selection = editor.selection;
        const text = document.getText(selection) || document.lineAt(selection.start.line).text;

        // Mock AI response
        const generatedCode = mockAIResponse(text);

        editor.edit(editBuilder => {
            if (selection.isEmpty) {
                editBuilder.replace(document.lineAt(selection.start.line).range, generatedCode);
            } else {
                editBuilder.replace(selection, generatedCode);
            }
        });
    });

    context.subscriptions.push(disposable);
}

function mockAIResponse(input: string): string {
    if (input.startsWith("view:")) {
        return (`
@login_required
def add_to_cart(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    cart.items.add(item)
    if cart.items.count() > 999:
        return redirect("bulk_order_view")
    return redirect("cart_detail")
        `);
    }
    return "// Generated code goes here";
}

export function deactivate() {}
