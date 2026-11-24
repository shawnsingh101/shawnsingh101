"""Runs a practice answer against one test case. Used in the browser (Pyodide, from public/py-worker.js) for practice
cards, and by the deck audit (tests/audit-decks.ts, with the computer's own Python) to check each card's solution.

A case gives the lines the program reads with input(), and the program's printed output is compared with the expected
output by the caller. A card's "check" (asserts) runs after the program, in the same namespace."""
import io
import json
import sys
import traceback


def run_case(src, stdin='', check=''):
    lines = iter(stdin.splitlines())

    def fake_input(prompt=''):
        # The prompt isn't printed, so outputs stay comparable whatever the prompt says.
        try:
            return next(lines)
        except StopIteration:
            raise EOFError('the program asked for more input than this test gives') from None

    out = io.StringIO()
    env = {'__name__': '__main__', 'input': fake_input}
    old, sys.stdout = sys.stdout, out
    error = None
    try:
        exec(compile(src, 'your code', 'exec'), env)
        if check:
            exec(compile(check, 'the check', 'exec'), env)
    except SystemExit:
        pass
    except SyntaxError as e:
        error = {'type': type(e).__name__, 'message': e.msg, 'line': e.lineno, 'inCheck': e.filename == 'the check'}
    except BaseException as e:
        frames = traceback.extract_tb(e.__traceback__)
        line = next((f.lineno for f in reversed(frames) if f.filename == 'your code'), None)
        in_check = any(f.filename == 'the check' for f in frames)
        error = {'type': type(e).__name__, 'message': str(e), 'line': line, 'inCheck': in_check}
    finally:
        sys.stdout = old
    return json.dumps({'output': out.getvalue(), 'error': error})


if __name__ == '__main__' and 'pyodide' not in sys.modules:  # the audit (in the browser this file is loaded, not run): {"src", "cases": [{"input"}], "check"} on stdin, a list of results out
    req = json.load(sys.stdin)
    print(json.dumps([json.loads(run_case(req['src'], c.get('input', ''), req.get('check', ''))) for c in req['cases']]))
