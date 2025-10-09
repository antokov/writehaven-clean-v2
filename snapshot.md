<!-- Generated 2025-10-09 22:44:09 -->
# writehaven-clean-v2 - Code Snapshot

## Projektstruktur
```
Auflistung der Ordnerpfade f³r Volume Boot
Volumeseriennummer : D072-BBC6
C:.
|   .gitattributes
|   .gitignore
|   Dockerfile
|   make-snapshot.ps1
|   README.md
|   snapshot.md
|   
+---.github
|   \---workflows
|           deploy.yml
|           
+---.vs
|   |   slnx.sqlite
|   |   VSWorkspaceState.json
|   |   
|   \---writehaven-clean-v2
|       +---FileContentIndex
|       |       129d9367-f519-4bcb-b922-4dbf8c652a82.vsidx
|       |       3a653f83-e9c9-4e9e-b9f4-ed61c5422e7a.vsidx
|       |       43ec08c0-5819-47c3-92f8-72bc03c53e24.vsidx
|       |       abdc1ea8-f33b-4b33-8e18-a7b356420ae9.vsidx
|       |       ec23d69f-27c4-4c96-b67b-d67cc5ce3fac.vsidx
|       |       
|       \---v17
|               DocumentLayout.backup.json
|               DocumentLayout.json
|               workspaceFileList.bin
|               
+---backend
|   |   .env.example
|   |   app.db
|   |   app.py
|   |   extensions.py
|   |   models.py
|   |   requirements.txt
|   |   wsgi.py
|   |   __init__.py
|   |   
|   +---.venv
|   |   |   pyvenv.cfg
|   |   |   
|   |   +---Include
|   |   |   \---site
|   |   |       \---python3.12
|   |   |           \---greenlet
|   |   |                   greenlet.h
|   |   |                   
|   |   +---Lib
|   |   |   \---site-packages
|   |   |       |   typing_extensions.py
|   |   |       |   
|   |   |       +---blinker
|   |   |       |   |   base.py
|   |   |       |   |   py.typed
|   |   |       |   |   _utilities.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   \---__pycache__
|   |   |       |           base.cpython-312.pyc
|   |   |       |           _utilities.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---blinker-1.9.0.dist-info
|   |   |       |       INSTALLER
|   |   |       |       LICENSE.txt
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---click
|   |   |       |   |   core.py
|   |   |       |   |   decorators.py
|   |   |       |   |   exceptions.py
|   |   |       |   |   formatting.py
|   |   |       |   |   globals.py
|   |   |       |   |   parser.py
|   |   |       |   |   py.typed
|   |   |       |   |   shell_completion.py
|   |   |       |   |   termui.py
|   |   |       |   |   testing.py
|   |   |       |   |   types.py
|   |   |       |   |   utils.py
|   |   |       |   |   _compat.py
|   |   |       |   |   _termui_impl.py
|   |   |       |   |   _textwrap.py
|   |   |       |   |   _utils.py
|   |   |       |   |   _winconsole.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   \---__pycache__
|   |   |       |           core.cpython-312.pyc
|   |   |       |           decorators.cpython-312.pyc
|   |   |       |           exceptions.cpython-312.pyc
|   |   |       |           formatting.cpython-312.pyc
|   |   |       |           globals.cpython-312.pyc
|   |   |       |           parser.cpython-312.pyc
|   |   |       |           shell_completion.cpython-312.pyc
|   |   |       |           termui.cpython-312.pyc
|   |   |       |           testing.cpython-312.pyc
|   |   |       |           types.cpython-312.pyc
|   |   |       |           utils.cpython-312.pyc
|   |   |       |           _compat.cpython-312.pyc
|   |   |       |           _termui_impl.cpython-312.pyc
|   |   |       |           _textwrap.cpython-312.pyc
|   |   |       |           _utils.cpython-312.pyc
|   |   |       |           _winconsole.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---click-8.3.0.dist-info
|   |   |       |   |   INSTALLER
|   |   |       |   |   METADATA
|   |   |       |   |   RECORD
|   |   |       |   |   WHEEL
|   |   |       |   |   
|   |   |       |   \---licenses
|   |   |       |           LICENSE.txt
|   |   |       |           
|   |   |       +---colorama
|   |   |       |   |   ansi.py
|   |   |       |   |   ansitowin32.py
|   |   |       |   |   initialise.py
|   |   |       |   |   win32.py
|   |   |       |   |   winterm.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   +---tests
|   |   |       |   |   |   ansitowin32_test.py
|   |   |       |   |   |   ansi_test.py
|   |   |       |   |   |   initialise_test.py
|   |   |       |   |   |   isatty_test.py
|   |   |       |   |   |   utils.py
|   |   |       |   |   |   winterm_test.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           ansitowin32_test.cpython-312.pyc
|   |   |       |   |           ansi_test.cpython-312.pyc
|   |   |       |   |           initialise_test.cpython-312.pyc
|   |   |       |   |           isatty_test.cpython-312.pyc
|   |   |       |   |           utils.cpython-312.pyc
|   |   |       |   |           winterm_test.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   \---__pycache__
|   |   |       |           ansi.cpython-312.pyc
|   |   |       |           ansitowin32.cpython-312.pyc
|   |   |       |           initialise.cpython-312.pyc
|   |   |       |           win32.cpython-312.pyc
|   |   |       |           winterm.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---colorama-0.4.6.dist-info
|   |   |       |   |   INSTALLER
|   |   |       |   |   METADATA
|   |   |       |   |   RECORD
|   |   |       |   |   WHEEL
|   |   |       |   |   
|   |   |       |   \---licenses
|   |   |       |           LICENSE.txt
|   |   |       |           
|   |   |       +---dotenv
|   |   |       |   |   cli.py
|   |   |       |   |   ipython.py
|   |   |       |   |   main.py
|   |   |       |   |   parser.py
|   |   |       |   |   py.typed
|   |   |       |   |   variables.py
|   |   |       |   |   version.py
|   |   |       |   |   __init__.py
|   |   |       |   |   __main__.py
|   |   |       |   |   
|   |   |       |   \---__pycache__
|   |   |       |           cli.cpython-312.pyc
|   |   |       |           ipython.cpython-312.pyc
|   |   |       |           main.cpython-312.pyc
|   |   |       |           parser.cpython-312.pyc
|   |   |       |           variables.cpython-312.pyc
|   |   |       |           version.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           __main__.cpython-312.pyc
|   |   |       |           
|   |   |       +---flask
|   |   |       |   |   app.py
|   |   |       |   |   blueprints.py
|   |   |       |   |   cli.py
|   |   |       |   |   config.py
|   |   |       |   |   ctx.py
|   |   |       |   |   debughelpers.py
|   |   |       |   |   globals.py
|   |   |       |   |   helpers.py
|   |   |       |   |   logging.py
|   |   |       |   |   py.typed
|   |   |       |   |   sessions.py
|   |   |       |   |   signals.py
|   |   |       |   |   templating.py
|   |   |       |   |   testing.py
|   |   |       |   |   typing.py
|   |   |       |   |   views.py
|   |   |       |   |   wrappers.py
|   |   |       |   |   __init__.py
|   |   |       |   |   __main__.py
|   |   |       |   |   
|   |   |       |   +---json
|   |   |       |   |   |   provider.py
|   |   |       |   |   |   tag.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           provider.cpython-312.pyc
|   |   |       |   |           tag.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---sansio
|   |   |       |   |   |   app.py
|   |   |       |   |   |   blueprints.py
|   |   |       |   |   |   README.md
|   |   |       |   |   |   scaffold.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           app.cpython-312.pyc
|   |   |       |   |           blueprints.cpython-312.pyc
|   |   |       |   |           scaffold.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   \---__pycache__
|   |   |       |           app.cpython-312.pyc
|   |   |       |           blueprints.cpython-312.pyc
|   |   |       |           cli.cpython-312.pyc
|   |   |       |           config.cpython-312.pyc
|   |   |       |           ctx.cpython-312.pyc
|   |   |       |           debughelpers.cpython-312.pyc
|   |   |       |           globals.cpython-312.pyc
|   |   |       |           helpers.cpython-312.pyc
|   |   |       |           logging.cpython-312.pyc
|   |   |       |           sessions.cpython-312.pyc
|   |   |       |           signals.cpython-312.pyc
|   |   |       |           templating.cpython-312.pyc
|   |   |       |           testing.cpython-312.pyc
|   |   |       |           typing.cpython-312.pyc
|   |   |       |           views.cpython-312.pyc
|   |   |       |           wrappers.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           __main__.cpython-312.pyc
|   |   |       |           
|   |   |       +---flask-3.0.3.dist-info
|   |   |       |       entry_points.txt
|   |   |       |       INSTALLER
|   |   |       |       LICENSE.txt
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       REQUESTED
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---flask_cors
|   |   |       |   |   core.py
|   |   |       |   |   decorator.py
|   |   |       |   |   extension.py
|   |   |       |   |   version.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   \---__pycache__
|   |   |       |           core.cpython-312.pyc
|   |   |       |           decorator.cpython-312.pyc
|   |   |       |           extension.cpython-312.pyc
|   |   |       |           version.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---Flask_Cors-4.0.1.dist-info
|   |   |       |       INSTALLER
|   |   |       |       LICENSE
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       REQUESTED
|   |   |       |       top_level.txt
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---flask_sqlalchemy
|   |   |       |   |   cli.py
|   |   |       |   |   extension.py
|   |   |       |   |   model.py
|   |   |       |   |   pagination.py
|   |   |       |   |   py.typed
|   |   |       |   |   query.py
|   |   |       |   |   record_queries.py
|   |   |       |   |   session.py
|   |   |       |   |   table.py
|   |   |       |   |   track_modifications.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   \---__pycache__
|   |   |       |           cli.cpython-312.pyc
|   |   |       |           extension.cpython-312.pyc
|   |   |       |           model.cpython-312.pyc
|   |   |       |           pagination.cpython-312.pyc
|   |   |       |           query.cpython-312.pyc
|   |   |       |           record_queries.cpython-312.pyc
|   |   |       |           session.cpython-312.pyc
|   |   |       |           table.cpython-312.pyc
|   |   |       |           track_modifications.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---flask_sqlalchemy-3.1.1.dist-info
|   |   |       |       INSTALLER
|   |   |       |       LICENSE.rst
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       REQUESTED
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---greenlet
|   |   |       |   |   CObjects.cpp
|   |   |       |   |   greenlet.cpp
|   |   |       |   |   greenlet.h
|   |   |       |   |   greenlet_allocator.hpp
|   |   |       |   |   greenlet_compiler_compat.hpp
|   |   |       |   |   greenlet_cpython_compat.hpp
|   |   |       |   |   greenlet_exceptions.hpp
|   |   |       |   |   greenlet_internal.hpp
|   |   |       |   |   greenlet_msvc_compat.hpp
|   |   |       |   |   greenlet_refs.hpp
|   |   |       |   |   greenlet_slp_switch.hpp
|   |   |       |   |   greenlet_thread_support.hpp
|   |   |       |   |   PyGreenlet.cpp
|   |   |       |   |   PyGreenlet.hpp
|   |   |       |   |   PyGreenletUnswitchable.cpp
|   |   |       |   |   PyModule.cpp
|   |   |       |   |   slp_platformselect.h
|   |   |       |   |   TBrokenGreenlet.cpp
|   |   |       |   |   TExceptionState.cpp
|   |   |       |   |   TGreenlet.cpp
|   |   |       |   |   TGreenlet.hpp
|   |   |       |   |   TGreenletGlobals.cpp
|   |   |       |   |   TMainGreenlet.cpp
|   |   |       |   |   TPythonState.cpp
|   |   |       |   |   TStackState.cpp
|   |   |       |   |   TThreadState.hpp
|   |   |       |   |   TThreadStateCreator.hpp
|   |   |       |   |   TThreadStateDestroy.cpp
|   |   |       |   |   TUserGreenlet.cpp
|   |   |       |   |   _greenlet.cp312-win_amd64.pyd
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   +---platform
|   |   |       |   |   |   setup_switch_x64_masm.cmd
|   |   |       |   |   |   switch_aarch64_gcc.h
|   |   |       |   |   |   switch_alpha_unix.h
|   |   |       |   |   |   switch_amd64_unix.h
|   |   |       |   |   |   switch_arm32_gcc.h
|   |   |       |   |   |   switch_arm32_ios.h
|   |   |       |   |   |   switch_arm64_masm.asm
|   |   |       |   |   |   switch_arm64_masm.obj
|   |   |       |   |   |   switch_arm64_msvc.h
|   |   |       |   |   |   switch_csky_gcc.h
|   |   |       |   |   |   switch_loongarch64_linux.h
|   |   |       |   |   |   switch_m68k_gcc.h
|   |   |       |   |   |   switch_mips_unix.h
|   |   |       |   |   |   switch_ppc64_aix.h
|   |   |       |   |   |   switch_ppc64_linux.h
|   |   |       |   |   |   switch_ppc_aix.h
|   |   |       |   |   |   switch_ppc_linux.h
|   |   |       |   |   |   switch_ppc_macosx.h
|   |   |       |   |   |   switch_ppc_unix.h
|   |   |       |   |   |   switch_riscv_unix.h
|   |   |       |   |   |   switch_s390_unix.h
|   |   |       |   |   |   switch_sh_gcc.h
|   |   |       |   |   |   switch_sparc_sun_gcc.h
|   |   |       |   |   |   switch_x32_unix.h
|   |   |       |   |   |   switch_x64_masm.asm
|   |   |       |   |   |   switch_x64_masm.obj
|   |   |       |   |   |   switch_x64_msvc.h
|   |   |       |   |   |   switch_x86_msvc.h
|   |   |       |   |   |   switch_x86_unix.h
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---tests
|   |   |       |   |   |   fail_clearing_run_switches.py
|   |   |       |   |   |   fail_cpp_exception.py
|   |   |       |   |   |   fail_initialstub_already_started.py
|   |   |       |   |   |   fail_slp_switch.py
|   |   |       |   |   |   fail_switch_three_greenlets.py
|   |   |       |   |   |   fail_switch_three_greenlets2.py
|   |   |       |   |   |   fail_switch_two_greenlets.py
|   |   |       |   |   |   leakcheck.py
|   |   |       |   |   |   test_contextvars.py
|   |   |       |   |   |   test_cpp.py
|   |   |       |   |   |   test_extension_interface.py
|   |   |       |   |   |   test_gc.py
|   |   |       |   |   |   test_generator.py
|   |   |       |   |   |   test_generator_nested.py
|   |   |       |   |   |   test_greenlet.py
|   |   |       |   |   |   test_greenlet_trash.py
|   |   |       |   |   |   test_leaks.py
|   |   |       |   |   |   test_stack_saved.py
|   |   |       |   |   |   test_throw.py
|   |   |       |   |   |   test_tracing.py
|   |   |       |   |   |   test_version.py
|   |   |       |   |   |   test_weakref.py
|   |   |       |   |   |   _test_extension.c
|   |   |       |   |   |   _test_extension.cp312-win_amd64.pyd
|   |   |       |   |   |   _test_extension_cpp.cp312-win_amd64.pyd
|   |   |       |   |   |   _test_extension_cpp.cpp
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           fail_clearing_run_switches.cpython-312.pyc
|   |   |       |   |           fail_cpp_exception.cpython-312.pyc
|   |   |       |   |           fail_initialstub_already_started.cpython-312.pyc
|   |   |       |   |           fail_slp_switch.cpython-312.pyc
|   |   |       |   |           fail_switch_three_greenlets.cpython-312.pyc
|   |   |       |   |           fail_switch_three_greenlets2.cpython-312.pyc
|   |   |       |   |           fail_switch_two_greenlets.cpython-312.pyc
|   |   |       |   |           leakcheck.cpython-312.pyc
|   |   |       |   |           test_contextvars.cpython-312.pyc
|   |   |       |   |           test_cpp.cpython-312.pyc
|   |   |       |   |           test_extension_interface.cpython-312.pyc
|   |   |       |   |           test_gc.cpython-312.pyc
|   |   |       |   |           test_generator.cpython-312.pyc
|   |   |       |   |           test_generator_nested.cpython-312.pyc
|   |   |       |   |           test_greenlet.cpython-312.pyc
|   |   |       |   |           test_greenlet_trash.cpython-312.pyc
|   |   |       |   |           test_leaks.cpython-312.pyc
|   |   |       |   |           test_stack_saved.cpython-312.pyc
|   |   |       |   |           test_throw.cpython-312.pyc
|   |   |       |   |           test_tracing.cpython-312.pyc
|   |   |       |   |           test_version.cpython-312.pyc
|   |   |       |   |           test_weakref.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   \---__pycache__
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---greenlet-3.2.4.dist-info
|   |   |       |   |   INSTALLER
|   |   |       |   |   METADATA
|   |   |       |   |   RECORD
|   |   |       |   |   top_level.txt
|   |   |       |   |   WHEEL
|   |   |       |   |   
|   |   |       |   \---licenses
|   |   |       |           LICENSE
|   |   |       |           LICENSE.PSF
|   |   |       |           
|   |   |       +---gunicorn
|   |   |       |   |   arbiter.py
|   |   |       |   |   config.py
|   |   |       |   |   debug.py
|   |   |       |   |   errors.py
|   |   |       |   |   glogging.py
|   |   |       |   |   pidfile.py
|   |   |       |   |   reloader.py
|   |   |       |   |   sock.py
|   |   |       |   |   systemd.py
|   |   |       |   |   util.py
|   |   |       |   |   __init__.py
|   |   |       |   |   __main__.py
|   |   |       |   |   
|   |   |       |   +---app
|   |   |       |   |   |   base.py
|   |   |       |   |   |   pasterapp.py
|   |   |       |   |   |   wsgiapp.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           base.cpython-312.pyc
|   |   |       |   |           pasterapp.cpython-312.pyc
|   |   |       |   |           wsgiapp.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---http
|   |   |       |   |   |   body.py
|   |   |       |   |   |   errors.py
|   |   |       |   |   |   message.py
|   |   |       |   |   |   parser.py
|   |   |       |   |   |   unreader.py
|   |   |       |   |   |   wsgi.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           body.cpython-312.pyc
|   |   |       |   |           errors.cpython-312.pyc
|   |   |       |   |           message.cpython-312.pyc
|   |   |       |   |           parser.cpython-312.pyc
|   |   |       |   |           unreader.cpython-312.pyc
|   |   |       |   |           wsgi.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---instrument
|   |   |       |   |   |   statsd.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           statsd.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---workers
|   |   |       |   |   |   base.py
|   |   |       |   |   |   base_async.py
|   |   |       |   |   |   geventlet.py
|   |   |       |   |   |   ggevent.py
|   |   |       |   |   |   gthread.py
|   |   |       |   |   |   gtornado.py
|   |   |       |   |   |   sync.py
|   |   |       |   |   |   workertmp.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           base.cpython-312.pyc
|   |   |       |   |           base_async.cpython-312.pyc
|   |   |       |   |           geventlet.cpython-312.pyc
|   |   |       |   |           ggevent.cpython-312.pyc
|   |   |       |   |           gthread.cpython-312.pyc
|   |   |       |   |           gtornado.cpython-312.pyc
|   |   |       |   |           sync.cpython-312.pyc
|   |   |       |   |           workertmp.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   \---__pycache__
|   |   |       |           arbiter.cpython-312.pyc
|   |   |       |           config.cpython-312.pyc
|   |   |       |           debug.cpython-312.pyc
|   |   |       |           errors.cpython-312.pyc
|   |   |       |           glogging.cpython-312.pyc
|   |   |       |           pidfile.cpython-312.pyc
|   |   |       |           reloader.cpython-312.pyc
|   |   |       |           sock.cpython-312.pyc
|   |   |       |           systemd.cpython-312.pyc
|   |   |       |           util.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           __main__.cpython-312.pyc
|   |   |       |           
|   |   |       +---gunicorn-22.0.0.dist-info
|   |   |       |       entry_points.txt
|   |   |       |       INSTALLER
|   |   |       |       LICENSE
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       REQUESTED
|   |   |       |       top_level.txt
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---itsdangerous
|   |   |       |   |   encoding.py
|   |   |       |   |   exc.py
|   |   |       |   |   py.typed
|   |   |       |   |   serializer.py
|   |   |       |   |   signer.py
|   |   |       |   |   timed.py
|   |   |       |   |   url_safe.py
|   |   |       |   |   _json.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   \---__pycache__
|   |   |       |           encoding.cpython-312.pyc
|   |   |       |           exc.cpython-312.pyc
|   |   |       |           serializer.cpython-312.pyc
|   |   |       |           signer.cpython-312.pyc
|   |   |       |           timed.cpython-312.pyc
|   |   |       |           url_safe.cpython-312.pyc
|   |   |       |           _json.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---itsdangerous-2.2.0.dist-info
|   |   |       |       INSTALLER
|   |   |       |       LICENSE.txt
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---jinja2
|   |   |       |   |   async_utils.py
|   |   |       |   |   bccache.py
|   |   |       |   |   compiler.py
|   |   |       |   |   constants.py
|   |   |       |   |   debug.py
|   |   |       |   |   defaults.py
|   |   |       |   |   environment.py
|   |   |       |   |   exceptions.py
|   |   |       |   |   ext.py
|   |   |       |   |   filters.py
|   |   |       |   |   idtracking.py
|   |   |       |   |   lexer.py
|   |   |       |   |   loaders.py
|   |   |       |   |   meta.py
|   |   |       |   |   nativetypes.py
|   |   |       |   |   nodes.py
|   |   |       |   |   optimizer.py
|   |   |       |   |   parser.py
|   |   |       |   |   py.typed
|   |   |       |   |   runtime.py
|   |   |       |   |   sandbox.py
|   |   |       |   |   tests.py
|   |   |       |   |   utils.py
|   |   |       |   |   visitor.py
|   |   |       |   |   _identifier.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   \---__pycache__
|   |   |       |           async_utils.cpython-312.pyc
|   |   |       |           bccache.cpython-312.pyc
|   |   |       |           compiler.cpython-312.pyc
|   |   |       |           constants.cpython-312.pyc
|   |   |       |           debug.cpython-312.pyc
|   |   |       |           defaults.cpython-312.pyc
|   |   |       |           environment.cpython-312.pyc
|   |   |       |           exceptions.cpython-312.pyc
|   |   |       |           ext.cpython-312.pyc
|   |   |       |           filters.cpython-312.pyc
|   |   |       |           idtracking.cpython-312.pyc
|   |   |       |           lexer.cpython-312.pyc
|   |   |       |           loaders.cpython-312.pyc
|   |   |       |           meta.cpython-312.pyc
|   |   |       |           nativetypes.cpython-312.pyc
|   |   |       |           nodes.cpython-312.pyc
|   |   |       |           optimizer.cpython-312.pyc
|   |   |       |           parser.cpython-312.pyc
|   |   |       |           runtime.cpython-312.pyc
|   |   |       |           sandbox.cpython-312.pyc
|   |   |       |           tests.cpython-312.pyc
|   |   |       |           utils.cpython-312.pyc
|   |   |       |           visitor.cpython-312.pyc
|   |   |       |           _identifier.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---jinja2-3.1.6.dist-info
|   |   |       |   |   entry_points.txt
|   |   |       |   |   INSTALLER
|   |   |       |   |   METADATA
|   |   |       |   |   RECORD
|   |   |       |   |   WHEEL
|   |   |       |   |   
|   |   |       |   \---licenses
|   |   |       |           LICENSE.txt
|   |   |       |           
|   |   |       +---markupsafe
|   |   |       |   |   py.typed
|   |   |       |   |   _native.py
|   |   |       |   |   _speedups.c
|   |   |       |   |   _speedups.cp312-win_amd64.pyd
|   |   |       |   |   _speedups.pyi
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   \---__pycache__
|   |   |       |           _native.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---markupsafe-3.0.3.dist-info
|   |   |       |   |   INSTALLER
|   |   |       |   |   METADATA
|   |   |       |   |   RECORD
|   |   |       |   |   top_level.txt
|   |   |       |   |   WHEEL
|   |   |       |   |   
|   |   |       |   \---licenses
|   |   |       |           LICENSE.txt
|   |   |       |           
|   |   |       +---packaging
|   |   |       |   |   markers.py
|   |   |       |   |   metadata.py
|   |   |       |   |   py.typed
|   |   |       |   |   requirements.py
|   |   |       |   |   specifiers.py
|   |   |       |   |   tags.py
|   |   |       |   |   utils.py
|   |   |       |   |   version.py
|   |   |       |   |   _elffile.py
|   |   |       |   |   _manylinux.py
|   |   |       |   |   _musllinux.py
|   |   |       |   |   _parser.py
|   |   |       |   |   _structures.py
|   |   |       |   |   _tokenizer.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   +---licenses
|   |   |       |   |   |   _spdx.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           _spdx.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   \---__pycache__
|   |   |       |           markers.cpython-312.pyc
|   |   |       |           metadata.cpython-312.pyc
|   |   |       |           requirements.cpython-312.pyc
|   |   |       |           specifiers.cpython-312.pyc
|   |   |       |           tags.cpython-312.pyc
|   |   |       |           utils.cpython-312.pyc
|   |   |       |           version.cpython-312.pyc
|   |   |       |           _elffile.cpython-312.pyc
|   |   |       |           _manylinux.cpython-312.pyc
|   |   |       |           _musllinux.cpython-312.pyc
|   |   |       |           _parser.cpython-312.pyc
|   |   |       |           _structures.cpython-312.pyc
|   |   |       |           _tokenizer.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---packaging-25.0.dist-info
|   |   |       |   |   INSTALLER
|   |   |       |   |   METADATA
|   |   |       |   |   RECORD
|   |   |       |   |   WHEEL
|   |   |       |   |   
|   |   |       |   \---licenses
|   |   |       |           LICENSE
|   |   |       |           LICENSE.APACHE
|   |   |       |           LICENSE.BSD
|   |   |       |           
|   |   |       +---pip
|   |   |       |   |   py.typed
|   |   |       |   |   __init__.py
|   |   |       |   |   __main__.py
|   |   |       |   |   __pip-runner__.py
|   |   |       |   |   
|   |   |       |   +---_internal
|   |   |       |   |   |   build_env.py
|   |   |       |   |   |   cache.py
|   |   |       |   |   |   configuration.py
|   |   |       |   |   |   exceptions.py
|   |   |       |   |   |   main.py
|   |   |       |   |   |   pyproject.py
|   |   |       |   |   |   self_outdated_check.py
|   |   |       |   |   |   wheel_builder.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   +---cli
|   |   |       |   |   |   |   autocompletion.py
|   |   |       |   |   |   |   base_command.py
|   |   |       |   |   |   |   cmdoptions.py
|   |   |       |   |   |   |   command_context.py
|   |   |       |   |   |   |   index_command.py
|   |   |       |   |   |   |   main.py
|   |   |       |   |   |   |   main_parser.py
|   |   |       |   |   |   |   parser.py
|   |   |       |   |   |   |   progress_bars.py
|   |   |       |   |   |   |   req_command.py
|   |   |       |   |   |   |   spinners.py
|   |   |       |   |   |   |   status_codes.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           autocompletion.cpython-312.pyc
|   |   |       |   |   |           base_command.cpython-312.pyc
|   |   |       |   |   |           cmdoptions.cpython-312.pyc
|   |   |       |   |   |           command_context.cpython-312.pyc
|   |   |       |   |   |           index_command.cpython-312.pyc
|   |   |       |   |   |           main.cpython-312.pyc
|   |   |       |   |   |           main_parser.cpython-312.pyc
|   |   |       |   |   |           parser.cpython-312.pyc
|   |   |       |   |   |           progress_bars.cpython-312.pyc
|   |   |       |   |   |           req_command.cpython-312.pyc
|   |   |       |   |   |           spinners.cpython-312.pyc
|   |   |       |   |   |           status_codes.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---commands
|   |   |       |   |   |   |   cache.py
|   |   |       |   |   |   |   check.py
|   |   |       |   |   |   |   completion.py
|   |   |       |   |   |   |   configuration.py
|   |   |       |   |   |   |   debug.py
|   |   |       |   |   |   |   download.py
|   |   |       |   |   |   |   freeze.py
|   |   |       |   |   |   |   hash.py
|   |   |       |   |   |   |   help.py
|   |   |       |   |   |   |   index.py
|   |   |       |   |   |   |   inspect.py
|   |   |       |   |   |   |   install.py
|   |   |       |   |   |   |   list.py
|   |   |       |   |   |   |   search.py
|   |   |       |   |   |   |   show.py
|   |   |       |   |   |   |   uninstall.py
|   |   |       |   |   |   |   wheel.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           cache.cpython-312.pyc
|   |   |       |   |   |           check.cpython-312.pyc
|   |   |       |   |   |           completion.cpython-312.pyc
|   |   |       |   |   |           configuration.cpython-312.pyc
|   |   |       |   |   |           debug.cpython-312.pyc
|   |   |       |   |   |           download.cpython-312.pyc
|   |   |       |   |   |           freeze.cpython-312.pyc
|   |   |       |   |   |           hash.cpython-312.pyc
|   |   |       |   |   |           help.cpython-312.pyc
|   |   |       |   |   |           index.cpython-312.pyc
|   |   |       |   |   |           inspect.cpython-312.pyc
|   |   |       |   |   |           install.cpython-312.pyc
|   |   |       |   |   |           list.cpython-312.pyc
|   |   |       |   |   |           search.cpython-312.pyc
|   |   |       |   |   |           show.cpython-312.pyc
|   |   |       |   |   |           uninstall.cpython-312.pyc
|   |   |       |   |   |           wheel.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---distributions
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   installed.py
|   |   |       |   |   |   |   sdist.py
|   |   |       |   |   |   |   wheel.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           installed.cpython-312.pyc
|   |   |       |   |   |           sdist.cpython-312.pyc
|   |   |       |   |   |           wheel.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---index
|   |   |       |   |   |   |   collector.py
|   |   |       |   |   |   |   package_finder.py
|   |   |       |   |   |   |   sources.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           collector.cpython-312.pyc
|   |   |       |   |   |           package_finder.cpython-312.pyc
|   |   |       |   |   |           sources.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---locations
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   _distutils.py
|   |   |       |   |   |   |   _sysconfig.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           _distutils.cpython-312.pyc
|   |   |       |   |   |           _sysconfig.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---metadata
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   pkg_resources.py
|   |   |       |   |   |   |   _json.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   +---importlib
|   |   |       |   |   |   |   |   _compat.py
|   |   |       |   |   |   |   |   _dists.py
|   |   |       |   |   |   |   |   _envs.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           _compat.cpython-312.pyc
|   |   |       |   |   |   |           _dists.cpython-312.pyc
|   |   |       |   |   |   |           _envs.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           pkg_resources.cpython-312.pyc
|   |   |       |   |   |           _json.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---models
|   |   |       |   |   |   |   candidate.py
|   |   |       |   |   |   |   direct_url.py
|   |   |       |   |   |   |   format_control.py
|   |   |       |   |   |   |   index.py
|   |   |       |   |   |   |   installation_report.py
|   |   |       |   |   |   |   link.py
|   |   |       |   |   |   |   scheme.py
|   |   |       |   |   |   |   search_scope.py
|   |   |       |   |   |   |   selection_prefs.py
|   |   |       |   |   |   |   target_python.py
|   |   |       |   |   |   |   wheel.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           candidate.cpython-312.pyc
|   |   |       |   |   |           direct_url.cpython-312.pyc
|   |   |       |   |   |           format_control.cpython-312.pyc
|   |   |       |   |   |           index.cpython-312.pyc
|   |   |       |   |   |           installation_report.cpython-312.pyc
|   |   |       |   |   |           link.cpython-312.pyc
|   |   |       |   |   |           scheme.cpython-312.pyc
|   |   |       |   |   |           search_scope.cpython-312.pyc
|   |   |       |   |   |           selection_prefs.cpython-312.pyc
|   |   |       |   |   |           target_python.cpython-312.pyc
|   |   |       |   |   |           wheel.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---network
|   |   |       |   |   |   |   auth.py
|   |   |       |   |   |   |   cache.py
|   |   |       |   |   |   |   download.py
|   |   |       |   |   |   |   lazy_wheel.py
|   |   |       |   |   |   |   session.py
|   |   |       |   |   |   |   utils.py
|   |   |       |   |   |   |   xmlrpc.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           auth.cpython-312.pyc
|   |   |       |   |   |           cache.cpython-312.pyc
|   |   |       |   |   |           download.cpython-312.pyc
|   |   |       |   |   |           lazy_wheel.cpython-312.pyc
|   |   |       |   |   |           session.cpython-312.pyc
|   |   |       |   |   |           utils.cpython-312.pyc
|   |   |       |   |   |           xmlrpc.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---operations
|   |   |       |   |   |   |   check.py
|   |   |       |   |   |   |   freeze.py
|   |   |       |   |   |   |   prepare.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   +---build
|   |   |       |   |   |   |   |   build_tracker.py
|   |   |       |   |   |   |   |   metadata.py
|   |   |       |   |   |   |   |   metadata_editable.py
|   |   |       |   |   |   |   |   metadata_legacy.py
|   |   |       |   |   |   |   |   wheel.py
|   |   |       |   |   |   |   |   wheel_editable.py
|   |   |       |   |   |   |   |   wheel_legacy.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           build_tracker.cpython-312.pyc
|   |   |       |   |   |   |           metadata.cpython-312.pyc
|   |   |       |   |   |   |           metadata_editable.cpython-312.pyc
|   |   |       |   |   |   |           metadata_legacy.cpython-312.pyc
|   |   |       |   |   |   |           wheel.cpython-312.pyc
|   |   |       |   |   |   |           wheel_editable.cpython-312.pyc
|   |   |       |   |   |   |           wheel_legacy.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   +---install
|   |   |       |   |   |   |   |   editable_legacy.py
|   |   |       |   |   |   |   |   wheel.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           editable_legacy.cpython-312.pyc
|   |   |       |   |   |   |           wheel.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           check.cpython-312.pyc
|   |   |       |   |   |           freeze.cpython-312.pyc
|   |   |       |   |   |           prepare.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---req
|   |   |       |   |   |   |   constructors.py
|   |   |       |   |   |   |   req_file.py
|   |   |       |   |   |   |   req_install.py
|   |   |       |   |   |   |   req_set.py
|   |   |       |   |   |   |   req_uninstall.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           constructors.cpython-312.pyc
|   |   |       |   |   |           req_file.cpython-312.pyc
|   |   |       |   |   |           req_install.cpython-312.pyc
|   |   |       |   |   |           req_set.cpython-312.pyc
|   |   |       |   |   |           req_uninstall.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---resolution
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   +---legacy
|   |   |       |   |   |   |   |   resolver.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           resolver.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   +---resolvelib
|   |   |       |   |   |   |   |   base.py
|   |   |       |   |   |   |   |   candidates.py
|   |   |       |   |   |   |   |   factory.py
|   |   |       |   |   |   |   |   found_candidates.py
|   |   |       |   |   |   |   |   provider.py
|   |   |       |   |   |   |   |   reporter.py
|   |   |       |   |   |   |   |   requirements.py
|   |   |       |   |   |   |   |   resolver.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           base.cpython-312.pyc
|   |   |       |   |   |   |           candidates.cpython-312.pyc
|   |   |       |   |   |   |           factory.cpython-312.pyc
|   |   |       |   |   |   |           found_candidates.cpython-312.pyc
|   |   |       |   |   |   |           provider.cpython-312.pyc
|   |   |       |   |   |   |           reporter.cpython-312.pyc
|   |   |       |   |   |   |           requirements.cpython-312.pyc
|   |   |       |   |   |   |           resolver.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---utils
|   |   |       |   |   |   |   appdirs.py
|   |   |       |   |   |   |   compat.py
|   |   |       |   |   |   |   compatibility_tags.py
|   |   |       |   |   |   |   datetime.py
|   |   |       |   |   |   |   deprecation.py
|   |   |       |   |   |   |   direct_url_helpers.py
|   |   |       |   |   |   |   egg_link.py
|   |   |       |   |   |   |   encoding.py
|   |   |       |   |   |   |   entrypoints.py
|   |   |       |   |   |   |   filesystem.py
|   |   |       |   |   |   |   filetypes.py
|   |   |       |   |   |   |   glibc.py
|   |   |       |   |   |   |   hashes.py
|   |   |       |   |   |   |   logging.py
|   |   |       |   |   |   |   misc.py
|   |   |       |   |   |   |   packaging.py
|   |   |       |   |   |   |   retry.py
|   |   |       |   |   |   |   setuptools_build.py
|   |   |       |   |   |   |   subprocess.py
|   |   |       |   |   |   |   temp_dir.py
|   |   |       |   |   |   |   unpacking.py
|   |   |       |   |   |   |   urls.py
|   |   |       |   |   |   |   virtualenv.py
|   |   |       |   |   |   |   wheel.py
|   |   |       |   |   |   |   _jaraco_text.py
|   |   |       |   |   |   |   _log.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           appdirs.cpython-312.pyc
|   |   |       |   |   |           compat.cpython-312.pyc
|   |   |       |   |   |           compatibility_tags.cpython-312.pyc
|   |   |       |   |   |           datetime.cpython-312.pyc
|   |   |       |   |   |           deprecation.cpython-312.pyc
|   |   |       |   |   |           direct_url_helpers.cpython-312.pyc
|   |   |       |   |   |           egg_link.cpython-312.pyc
|   |   |       |   |   |           encoding.cpython-312.pyc
|   |   |       |   |   |           entrypoints.cpython-312.pyc
|   |   |       |   |   |           filesystem.cpython-312.pyc
|   |   |       |   |   |           filetypes.cpython-312.pyc
|   |   |       |   |   |           glibc.cpython-312.pyc
|   |   |       |   |   |           hashes.cpython-312.pyc
|   |   |       |   |   |           logging.cpython-312.pyc
|   |   |       |   |   |           misc.cpython-312.pyc
|   |   |       |   |   |           packaging.cpython-312.pyc
|   |   |       |   |   |           retry.cpython-312.pyc
|   |   |       |   |   |           setuptools_build.cpython-312.pyc
|   |   |       |   |   |           subprocess.cpython-312.pyc
|   |   |       |   |   |           temp_dir.cpython-312.pyc
|   |   |       |   |   |           unpacking.cpython-312.pyc
|   |   |       |   |   |           urls.cpython-312.pyc
|   |   |       |   |   |           virtualenv.cpython-312.pyc
|   |   |       |   |   |           wheel.cpython-312.pyc
|   |   |       |   |   |           _jaraco_text.cpython-312.pyc
|   |   |       |   |   |           _log.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---vcs
|   |   |       |   |   |   |   bazaar.py
|   |   |       |   |   |   |   git.py
|   |   |       |   |   |   |   mercurial.py
|   |   |       |   |   |   |   subversion.py
|   |   |       |   |   |   |   versioncontrol.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           bazaar.cpython-312.pyc
|   |   |       |   |   |           git.cpython-312.pyc
|   |   |       |   |   |           mercurial.cpython-312.pyc
|   |   |       |   |   |           subversion.cpython-312.pyc
|   |   |       |   |   |           versioncontrol.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   \---__pycache__
|   |   |       |   |           build_env.cpython-312.pyc
|   |   |       |   |           cache.cpython-312.pyc
|   |   |       |   |           configuration.cpython-312.pyc
|   |   |       |   |           exceptions.cpython-312.pyc
|   |   |       |   |           main.cpython-312.pyc
|   |   |       |   |           pyproject.cpython-312.pyc
|   |   |       |   |           self_outdated_check.cpython-312.pyc
|   |   |       |   |           wheel_builder.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---_vendor
|   |   |       |   |   |   typing_extensions.py
|   |   |       |   |   |   vendor.txt
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   +---cachecontrol
|   |   |       |   |   |   |   adapter.py
|   |   |       |   |   |   |   cache.py
|   |   |       |   |   |   |   controller.py
|   |   |       |   |   |   |   filewrapper.py
|   |   |       |   |   |   |   heuristics.py
|   |   |       |   |   |   |   py.typed
|   |   |       |   |   |   |   serialize.py
|   |   |       |   |   |   |   wrapper.py
|   |   |       |   |   |   |   _cmd.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   +---caches
|   |   |       |   |   |   |   |   file_cache.py
|   |   |       |   |   |   |   |   redis_cache.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           file_cache.cpython-312.pyc
|   |   |       |   |   |   |           redis_cache.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           adapter.cpython-312.pyc
|   |   |       |   |   |           cache.cpython-312.pyc
|   |   |       |   |   |           controller.cpython-312.pyc
|   |   |       |   |   |           filewrapper.cpython-312.pyc
|   |   |       |   |   |           heuristics.cpython-312.pyc
|   |   |       |   |   |           serialize.cpython-312.pyc
|   |   |       |   |   |           wrapper.cpython-312.pyc
|   |   |       |   |   |           _cmd.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---certifi
|   |   |       |   |   |   |   cacert.pem
|   |   |       |   |   |   |   core.py
|   |   |       |   |   |   |   py.typed
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   __main__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           core.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           __main__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---distlib
|   |   |       |   |   |   |   compat.py
|   |   |       |   |   |   |   database.py
|   |   |       |   |   |   |   index.py
|   |   |       |   |   |   |   locators.py
|   |   |       |   |   |   |   manifest.py
|   |   |       |   |   |   |   markers.py
|   |   |       |   |   |   |   metadata.py
|   |   |       |   |   |   |   resources.py
|   |   |       |   |   |   |   scripts.py
|   |   |       |   |   |   |   t32.exe
|   |   |       |   |   |   |   t64-arm.exe
|   |   |       |   |   |   |   t64.exe
|   |   |       |   |   |   |   util.py
|   |   |       |   |   |   |   version.py
|   |   |       |   |   |   |   w32.exe
|   |   |       |   |   |   |   w64-arm.exe
|   |   |       |   |   |   |   w64.exe
|   |   |       |   |   |   |   wheel.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           compat.cpython-312.pyc
|   |   |       |   |   |           database.cpython-312.pyc
|   |   |       |   |   |           index.cpython-312.pyc
|   |   |       |   |   |           locators.cpython-312.pyc
|   |   |       |   |   |           manifest.cpython-312.pyc
|   |   |       |   |   |           markers.cpython-312.pyc
|   |   |       |   |   |           metadata.cpython-312.pyc
|   |   |       |   |   |           resources.cpython-312.pyc
|   |   |       |   |   |           scripts.cpython-312.pyc
|   |   |       |   |   |           util.cpython-312.pyc
|   |   |       |   |   |           version.cpython-312.pyc
|   |   |       |   |   |           wheel.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---distro
|   |   |       |   |   |   |   distro.py
|   |   |       |   |   |   |   py.typed
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   __main__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           distro.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           __main__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---idna
|   |   |       |   |   |   |   codec.py
|   |   |       |   |   |   |   compat.py
|   |   |       |   |   |   |   core.py
|   |   |       |   |   |   |   idnadata.py
|   |   |       |   |   |   |   intranges.py
|   |   |       |   |   |   |   package_data.py
|   |   |       |   |   |   |   py.typed
|   |   |       |   |   |   |   uts46data.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           codec.cpython-312.pyc
|   |   |       |   |   |           compat.cpython-312.pyc
|   |   |       |   |   |           core.cpython-312.pyc
|   |   |       |   |   |           idnadata.cpython-312.pyc
|   |   |       |   |   |           intranges.cpython-312.pyc
|   |   |       |   |   |           package_data.cpython-312.pyc
|   |   |       |   |   |           uts46data.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---msgpack
|   |   |       |   |   |   |   exceptions.py
|   |   |       |   |   |   |   ext.py
|   |   |       |   |   |   |   fallback.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           exceptions.cpython-312.pyc
|   |   |       |   |   |           ext.cpython-312.pyc
|   |   |       |   |   |           fallback.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---packaging
|   |   |       |   |   |   |   markers.py
|   |   |       |   |   |   |   metadata.py
|   |   |       |   |   |   |   py.typed
|   |   |       |   |   |   |   requirements.py
|   |   |       |   |   |   |   specifiers.py
|   |   |       |   |   |   |   tags.py
|   |   |       |   |   |   |   utils.py
|   |   |       |   |   |   |   version.py
|   |   |       |   |   |   |   _elffile.py
|   |   |       |   |   |   |   _manylinux.py
|   |   |       |   |   |   |   _musllinux.py
|   |   |       |   |   |   |   _parser.py
|   |   |       |   |   |   |   _structures.py
|   |   |       |   |   |   |   _tokenizer.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           markers.cpython-312.pyc
|   |   |       |   |   |           metadata.cpython-312.pyc
|   |   |       |   |   |           requirements.cpython-312.pyc
|   |   |       |   |   |           specifiers.cpython-312.pyc
|   |   |       |   |   |           tags.cpython-312.pyc
|   |   |       |   |   |           utils.cpython-312.pyc
|   |   |       |   |   |           version.cpython-312.pyc
|   |   |       |   |   |           _elffile.cpython-312.pyc
|   |   |       |   |   |           _manylinux.cpython-312.pyc
|   |   |       |   |   |           _musllinux.cpython-312.pyc
|   |   |       |   |   |           _parser.cpython-312.pyc
|   |   |       |   |   |           _structures.cpython-312.pyc
|   |   |       |   |   |           _tokenizer.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---pkg_resources
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---platformdirs
|   |   |       |   |   |   |   android.py
|   |   |       |   |   |   |   api.py
|   |   |       |   |   |   |   macos.py
|   |   |       |   |   |   |   py.typed
|   |   |       |   |   |   |   unix.py
|   |   |       |   |   |   |   version.py
|   |   |       |   |   |   |   windows.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   __main__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           android.cpython-312.pyc
|   |   |       |   |   |           api.cpython-312.pyc
|   |   |       |   |   |           macos.cpython-312.pyc
|   |   |       |   |   |           unix.cpython-312.pyc
|   |   |       |   |   |           version.cpython-312.pyc
|   |   |       |   |   |           windows.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           __main__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---pygments
|   |   |       |   |   |   |   cmdline.py
|   |   |       |   |   |   |   console.py
|   |   |       |   |   |   |   filter.py
|   |   |       |   |   |   |   formatter.py
|   |   |       |   |   |   |   lexer.py
|   |   |       |   |   |   |   modeline.py
|   |   |       |   |   |   |   plugin.py
|   |   |       |   |   |   |   regexopt.py
|   |   |       |   |   |   |   scanner.py
|   |   |       |   |   |   |   sphinxext.py
|   |   |       |   |   |   |   style.py
|   |   |       |   |   |   |   token.py
|   |   |       |   |   |   |   unistring.py
|   |   |       |   |   |   |   util.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   __main__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   +---filters
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   +---formatters
|   |   |       |   |   |   |   |   bbcode.py
|   |   |       |   |   |   |   |   groff.py
|   |   |       |   |   |   |   |   html.py
|   |   |       |   |   |   |   |   img.py
|   |   |       |   |   |   |   |   irc.py
|   |   |       |   |   |   |   |   latex.py
|   |   |       |   |   |   |   |   other.py
|   |   |       |   |   |   |   |   pangomarkup.py
|   |   |       |   |   |   |   |   rtf.py
|   |   |       |   |   |   |   |   svg.py
|   |   |       |   |   |   |   |   terminal.py
|   |   |       |   |   |   |   |   terminal256.py
|   |   |       |   |   |   |   |   _mapping.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           bbcode.cpython-312.pyc
|   |   |       |   |   |   |           groff.cpython-312.pyc
|   |   |       |   |   |   |           html.cpython-312.pyc
|   |   |       |   |   |   |           img.cpython-312.pyc
|   |   |       |   |   |   |           irc.cpython-312.pyc
|   |   |       |   |   |   |           latex.cpython-312.pyc
|   |   |       |   |   |   |           other.cpython-312.pyc
|   |   |       |   |   |   |           pangomarkup.cpython-312.pyc
|   |   |       |   |   |   |           rtf.cpython-312.pyc
|   |   |       |   |   |   |           svg.cpython-312.pyc
|   |   |       |   |   |   |           terminal.cpython-312.pyc
|   |   |       |   |   |   |           terminal256.cpython-312.pyc
|   |   |       |   |   |   |           _mapping.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   +---lexers
|   |   |       |   |   |   |   |   python.py
|   |   |       |   |   |   |   |   _mapping.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           python.cpython-312.pyc
|   |   |       |   |   |   |           _mapping.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   +---styles
|   |   |       |   |   |   |   |   _mapping.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           _mapping.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           cmdline.cpython-312.pyc
|   |   |       |   |   |           console.cpython-312.pyc
|   |   |       |   |   |           filter.cpython-312.pyc
|   |   |       |   |   |           formatter.cpython-312.pyc
|   |   |       |   |   |           lexer.cpython-312.pyc
|   |   |       |   |   |           modeline.cpython-312.pyc
|   |   |       |   |   |           plugin.cpython-312.pyc
|   |   |       |   |   |           regexopt.cpython-312.pyc
|   |   |       |   |   |           scanner.cpython-312.pyc
|   |   |       |   |   |           sphinxext.cpython-312.pyc
|   |   |       |   |   |           style.cpython-312.pyc
|   |   |       |   |   |           token.cpython-312.pyc
|   |   |       |   |   |           unistring.cpython-312.pyc
|   |   |       |   |   |           util.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           __main__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---pyproject_hooks
|   |   |       |   |   |   |   _compat.py
|   |   |       |   |   |   |   _impl.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   +---_in_process
|   |   |       |   |   |   |   |   _in_process.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           _in_process.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           _compat.cpython-312.pyc
|   |   |       |   |   |           _impl.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---requests
|   |   |       |   |   |   |   adapters.py
|   |   |       |   |   |   |   api.py
|   |   |       |   |   |   |   auth.py
|   |   |       |   |   |   |   certs.py
|   |   |       |   |   |   |   compat.py
|   |   |       |   |   |   |   cookies.py
|   |   |       |   |   |   |   exceptions.py
|   |   |       |   |   |   |   help.py
|   |   |       |   |   |   |   hooks.py
|   |   |       |   |   |   |   models.py
|   |   |       |   |   |   |   packages.py
|   |   |       |   |   |   |   sessions.py
|   |   |       |   |   |   |   status_codes.py
|   |   |       |   |   |   |   structures.py
|   |   |       |   |   |   |   utils.py
|   |   |       |   |   |   |   _internal_utils.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   __version__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           adapters.cpython-312.pyc
|   |   |       |   |   |           api.cpython-312.pyc
|   |   |       |   |   |           auth.cpython-312.pyc
|   |   |       |   |   |           certs.cpython-312.pyc
|   |   |       |   |   |           compat.cpython-312.pyc
|   |   |       |   |   |           cookies.cpython-312.pyc
|   |   |       |   |   |           exceptions.cpython-312.pyc
|   |   |       |   |   |           help.cpython-312.pyc
|   |   |       |   |   |           hooks.cpython-312.pyc
|   |   |       |   |   |           models.cpython-312.pyc
|   |   |       |   |   |           packages.cpython-312.pyc
|   |   |       |   |   |           sessions.cpython-312.pyc
|   |   |       |   |   |           status_codes.cpython-312.pyc
|   |   |       |   |   |           structures.cpython-312.pyc
|   |   |       |   |   |           utils.cpython-312.pyc
|   |   |       |   |   |           _internal_utils.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           __version__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---resolvelib
|   |   |       |   |   |   |   providers.py
|   |   |       |   |   |   |   py.typed
|   |   |       |   |   |   |   reporters.py
|   |   |       |   |   |   |   resolvers.py
|   |   |       |   |   |   |   structs.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   +---compat
|   |   |       |   |   |   |   |   collections_abc.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           collections_abc.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           providers.cpython-312.pyc
|   |   |       |   |   |           reporters.cpython-312.pyc
|   |   |       |   |   |           resolvers.cpython-312.pyc
|   |   |       |   |   |           structs.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---rich
|   |   |       |   |   |   |   abc.py
|   |   |       |   |   |   |   align.py
|   |   |       |   |   |   |   ansi.py
|   |   |       |   |   |   |   bar.py
|   |   |       |   |   |   |   box.py
|   |   |       |   |   |   |   cells.py
|   |   |       |   |   |   |   color.py
|   |   |       |   |   |   |   color_triplet.py
|   |   |       |   |   |   |   columns.py
|   |   |       |   |   |   |   console.py
|   |   |       |   |   |   |   constrain.py
|   |   |       |   |   |   |   containers.py
|   |   |       |   |   |   |   control.py
|   |   |       |   |   |   |   default_styles.py
|   |   |       |   |   |   |   diagnose.py
|   |   |       |   |   |   |   emoji.py
|   |   |       |   |   |   |   errors.py
|   |   |       |   |   |   |   filesize.py
|   |   |       |   |   |   |   file_proxy.py
|   |   |       |   |   |   |   highlighter.py
|   |   |       |   |   |   |   json.py
|   |   |       |   |   |   |   jupyter.py
|   |   |       |   |   |   |   layout.py
|   |   |       |   |   |   |   live.py
|   |   |       |   |   |   |   live_render.py
|   |   |       |   |   |   |   logging.py
|   |   |       |   |   |   |   markup.py
|   |   |       |   |   |   |   measure.py
|   |   |       |   |   |   |   padding.py
|   |   |       |   |   |   |   pager.py
|   |   |       |   |   |   |   palette.py
|   |   |       |   |   |   |   panel.py
|   |   |       |   |   |   |   pretty.py
|   |   |       |   |   |   |   progress.py
|   |   |       |   |   |   |   progress_bar.py
|   |   |       |   |   |   |   prompt.py
|   |   |       |   |   |   |   protocol.py
|   |   |       |   |   |   |   py.typed
|   |   |       |   |   |   |   region.py
|   |   |       |   |   |   |   repr.py
|   |   |       |   |   |   |   rule.py
|   |   |       |   |   |   |   scope.py
|   |   |       |   |   |   |   screen.py
|   |   |       |   |   |   |   segment.py
|   |   |       |   |   |   |   spinner.py
|   |   |       |   |   |   |   status.py
|   |   |       |   |   |   |   style.py
|   |   |       |   |   |   |   styled.py
|   |   |       |   |   |   |   syntax.py
|   |   |       |   |   |   |   table.py
|   |   |       |   |   |   |   terminal_theme.py
|   |   |       |   |   |   |   text.py
|   |   |       |   |   |   |   theme.py
|   |   |       |   |   |   |   themes.py
|   |   |       |   |   |   |   traceback.py
|   |   |       |   |   |   |   tree.py
|   |   |       |   |   |   |   _cell_widths.py
|   |   |       |   |   |   |   _emoji_codes.py
|   |   |       |   |   |   |   _emoji_replace.py
|   |   |       |   |   |   |   _export_format.py
|   |   |       |   |   |   |   _extension.py
|   |   |       |   |   |   |   _fileno.py
|   |   |       |   |   |   |   _inspect.py
|   |   |       |   |   |   |   _log_render.py
|   |   |       |   |   |   |   _loop.py
|   |   |       |   |   |   |   _null_file.py
|   |   |       |   |   |   |   _palettes.py
|   |   |       |   |   |   |   _pick.py
|   |   |       |   |   |   |   _ratio.py
|   |   |       |   |   |   |   _spinners.py
|   |   |       |   |   |   |   _stack.py
|   |   |       |   |   |   |   _timer.py
|   |   |       |   |   |   |   _win32_console.py
|   |   |       |   |   |   |   _windows.py
|   |   |       |   |   |   |   _windows_renderer.py
|   |   |       |   |   |   |   _wrap.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   __main__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           abc.cpython-312.pyc
|   |   |       |   |   |           align.cpython-312.pyc
|   |   |       |   |   |           ansi.cpython-312.pyc
|   |   |       |   |   |           bar.cpython-312.pyc
|   |   |       |   |   |           box.cpython-312.pyc
|   |   |       |   |   |           cells.cpython-312.pyc
|   |   |       |   |   |           color.cpython-312.pyc
|   |   |       |   |   |           color_triplet.cpython-312.pyc
|   |   |       |   |   |           columns.cpython-312.pyc
|   |   |       |   |   |           console.cpython-312.pyc
|   |   |       |   |   |           constrain.cpython-312.pyc
|   |   |       |   |   |           containers.cpython-312.pyc
|   |   |       |   |   |           control.cpython-312.pyc
|   |   |       |   |   |           default_styles.cpython-312.pyc
|   |   |       |   |   |           diagnose.cpython-312.pyc
|   |   |       |   |   |           emoji.cpython-312.pyc
|   |   |       |   |   |           errors.cpython-312.pyc
|   |   |       |   |   |           filesize.cpython-312.pyc
|   |   |       |   |   |           file_proxy.cpython-312.pyc
|   |   |       |   |   |           highlighter.cpython-312.pyc
|   |   |       |   |   |           json.cpython-312.pyc
|   |   |       |   |   |           jupyter.cpython-312.pyc
|   |   |       |   |   |           layout.cpython-312.pyc
|   |   |       |   |   |           live.cpython-312.pyc
|   |   |       |   |   |           live_render.cpython-312.pyc
|   |   |       |   |   |           logging.cpython-312.pyc
|   |   |       |   |   |           markup.cpython-312.pyc
|   |   |       |   |   |           measure.cpython-312.pyc
|   |   |       |   |   |           padding.cpython-312.pyc
|   |   |       |   |   |           pager.cpython-312.pyc
|   |   |       |   |   |           palette.cpython-312.pyc
|   |   |       |   |   |           panel.cpython-312.pyc
|   |   |       |   |   |           pretty.cpython-312.pyc
|   |   |       |   |   |           progress.cpython-312.pyc
|   |   |       |   |   |           progress_bar.cpython-312.pyc
|   |   |       |   |   |           prompt.cpython-312.pyc
|   |   |       |   |   |           protocol.cpython-312.pyc
|   |   |       |   |   |           region.cpython-312.pyc
|   |   |       |   |   |           repr.cpython-312.pyc
|   |   |       |   |   |           rule.cpython-312.pyc
|   |   |       |   |   |           scope.cpython-312.pyc
|   |   |       |   |   |           screen.cpython-312.pyc
|   |   |       |   |   |           segment.cpython-312.pyc
|   |   |       |   |   |           spinner.cpython-312.pyc
|   |   |       |   |   |           status.cpython-312.pyc
|   |   |       |   |   |           style.cpython-312.pyc
|   |   |       |   |   |           styled.cpython-312.pyc
|   |   |       |   |   |           syntax.cpython-312.pyc
|   |   |       |   |   |           table.cpython-312.pyc
|   |   |       |   |   |           terminal_theme.cpython-312.pyc
|   |   |       |   |   |           text.cpython-312.pyc
|   |   |       |   |   |           theme.cpython-312.pyc
|   |   |       |   |   |           themes.cpython-312.pyc
|   |   |       |   |   |           traceback.cpython-312.pyc
|   |   |       |   |   |           tree.cpython-312.pyc
|   |   |       |   |   |           _cell_widths.cpython-312.pyc
|   |   |       |   |   |           _emoji_codes.cpython-312.pyc
|   |   |       |   |   |           _emoji_replace.cpython-312.pyc
|   |   |       |   |   |           _export_format.cpython-312.pyc
|   |   |       |   |   |           _extension.cpython-312.pyc
|   |   |       |   |   |           _fileno.cpython-312.pyc
|   |   |       |   |   |           _inspect.cpython-312.pyc
|   |   |       |   |   |           _log_render.cpython-312.pyc
|   |   |       |   |   |           _loop.cpython-312.pyc
|   |   |       |   |   |           _null_file.cpython-312.pyc
|   |   |       |   |   |           _palettes.cpython-312.pyc
|   |   |       |   |   |           _pick.cpython-312.pyc
|   |   |       |   |   |           _ratio.cpython-312.pyc
|   |   |       |   |   |           _spinners.cpython-312.pyc
|   |   |       |   |   |           _stack.cpython-312.pyc
|   |   |       |   |   |           _timer.cpython-312.pyc
|   |   |       |   |   |           _win32_console.cpython-312.pyc
|   |   |       |   |   |           _windows.cpython-312.pyc
|   |   |       |   |   |           _windows_renderer.cpython-312.pyc
|   |   |       |   |   |           _wrap.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           __main__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---tomli
|   |   |       |   |   |   |   py.typed
|   |   |       |   |   |   |   _parser.py
|   |   |       |   |   |   |   _re.py
|   |   |       |   |   |   |   _types.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           _parser.cpython-312.pyc
|   |   |       |   |   |           _re.cpython-312.pyc
|   |   |       |   |   |           _types.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---truststore
|   |   |       |   |   |   |   py.typed
|   |   |       |   |   |   |   _api.py
|   |   |       |   |   |   |   _macos.py
|   |   |       |   |   |   |   _openssl.py
|   |   |       |   |   |   |   _ssl_constants.py
|   |   |       |   |   |   |   _windows.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           _api.cpython-312.pyc
|   |   |       |   |   |           _macos.cpython-312.pyc
|   |   |       |   |   |           _openssl.cpython-312.pyc
|   |   |       |   |   |           _ssl_constants.cpython-312.pyc
|   |   |       |   |   |           _windows.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---urllib3
|   |   |       |   |   |   |   connection.py
|   |   |       |   |   |   |   connectionpool.py
|   |   |       |   |   |   |   exceptions.py
|   |   |       |   |   |   |   fields.py
|   |   |       |   |   |   |   filepost.py
|   |   |       |   |   |   |   poolmanager.py
|   |   |       |   |   |   |   request.py
|   |   |       |   |   |   |   response.py
|   |   |       |   |   |   |   _collections.py
|   |   |       |   |   |   |   _version.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   +---contrib
|   |   |       |   |   |   |   |   appengine.py
|   |   |       |   |   |   |   |   ntlmpool.py
|   |   |       |   |   |   |   |   pyopenssl.py
|   |   |       |   |   |   |   |   securetransport.py
|   |   |       |   |   |   |   |   socks.py
|   |   |       |   |   |   |   |   _appengine_environ.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   +---_securetransport
|   |   |       |   |   |   |   |   |   bindings.py
|   |   |       |   |   |   |   |   |   low_level.py
|   |   |       |   |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   |   
|   |   |       |   |   |   |   |   \---__pycache__
|   |   |       |   |   |   |   |           bindings.cpython-312.pyc
|   |   |       |   |   |   |   |           low_level.cpython-312.pyc
|   |   |       |   |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |   |           
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           appengine.cpython-312.pyc
|   |   |       |   |   |   |           ntlmpool.cpython-312.pyc
|   |   |       |   |   |   |           pyopenssl.cpython-312.pyc
|   |   |       |   |   |   |           securetransport.cpython-312.pyc
|   |   |       |   |   |   |           socks.cpython-312.pyc
|   |   |       |   |   |   |           _appengine_environ.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   +---packages
|   |   |       |   |   |   |   |   six.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   +---backports
|   |   |       |   |   |   |   |   |   makefile.py
|   |   |       |   |   |   |   |   |   weakref_finalize.py
|   |   |       |   |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   |   
|   |   |       |   |   |   |   |   \---__pycache__
|   |   |       |   |   |   |   |           makefile.cpython-312.pyc
|   |   |       |   |   |   |   |           weakref_finalize.cpython-312.pyc
|   |   |       |   |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |   |           
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           six.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   +---util
|   |   |       |   |   |   |   |   connection.py
|   |   |       |   |   |   |   |   proxy.py
|   |   |       |   |   |   |   |   queue.py
|   |   |       |   |   |   |   |   request.py
|   |   |       |   |   |   |   |   response.py
|   |   |       |   |   |   |   |   retry.py
|   |   |       |   |   |   |   |   ssltransport.py
|   |   |       |   |   |   |   |   ssl_.py
|   |   |       |   |   |   |   |   ssl_match_hostname.py
|   |   |       |   |   |   |   |   timeout.py
|   |   |       |   |   |   |   |   url.py
|   |   |       |   |   |   |   |   wait.py
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           connection.cpython-312.pyc
|   |   |       |   |   |   |           proxy.cpython-312.pyc
|   |   |       |   |   |   |           queue.cpython-312.pyc
|   |   |       |   |   |   |           request.cpython-312.pyc
|   |   |       |   |   |   |           response.cpython-312.pyc
|   |   |       |   |   |   |           retry.cpython-312.pyc
|   |   |       |   |   |   |           ssltransport.cpython-312.pyc
|   |   |       |   |   |   |           ssl_.cpython-312.pyc
|   |   |       |   |   |   |           ssl_match_hostname.cpython-312.pyc
|   |   |       |   |   |   |           timeout.cpython-312.pyc
|   |   |       |   |   |   |           url.cpython-312.pyc
|   |   |       |   |   |   |           wait.cpython-312.pyc
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           connection.cpython-312.pyc
|   |   |       |   |   |           connectionpool.cpython-312.pyc
|   |   |       |   |   |           exceptions.cpython-312.pyc
|   |   |       |   |   |           fields.cpython-312.pyc
|   |   |       |   |   |           filepost.cpython-312.pyc
|   |   |       |   |   |           poolmanager.cpython-312.pyc
|   |   |       |   |   |           request.cpython-312.pyc
|   |   |       |   |   |           response.cpython-312.pyc
|   |   |       |   |   |           _collections.cpython-312.pyc
|   |   |       |   |   |           _version.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   \---__pycache__
|   |   |       |   |           typing_extensions.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   \---__pycache__
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           __main__.cpython-312.pyc
|   |   |       |           __pip-runner__.cpython-312.pyc
|   |   |       |           
|   |   |       +---pip-24.2.dist-info
|   |   |       |       AUTHORS.txt
|   |   |       |       entry_points.txt
|   |   |       |       INSTALLER
|   |   |       |       LICENSE.txt
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       REQUESTED
|   |   |       |       top_level.txt
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---psycopg
|   |   |       |   |   abc.py
|   |   |       |   |   adapt.py
|   |   |       |   |   client_cursor.py
|   |   |       |   |   connection.py
|   |   |       |   |   connection_async.py
|   |   |       |   |   conninfo.py
|   |   |       |   |   copy.py
|   |   |       |   |   cursor.py
|   |   |       |   |   cursor_async.py
|   |   |       |   |   dbapi20.py
|   |   |       |   |   errors.py
|   |   |       |   |   generators.py
|   |   |       |   |   postgres.py
|   |   |       |   |   py.typed
|   |   |       |   |   raw_cursor.py
|   |   |       |   |   rows.py
|   |   |       |   |   server_cursor.py
|   |   |       |   |   sql.py
|   |   |       |   |   transaction.py
|   |   |       |   |   version.py
|   |   |       |   |   waiting.py
|   |   |       |   |   _acompat.py
|   |   |       |   |   _adapters_map.py
|   |   |       |   |   _capabilities.py
|   |   |       |   |   _cmodule.py
|   |   |       |   |   _column.py
|   |   |       |   |   _compat.py
|   |   |       |   |   _connection_base.py
|   |   |       |   |   _connection_info.py
|   |   |       |   |   _conninfo_attempts.py
|   |   |       |   |   _conninfo_attempts_async.py
|   |   |       |   |   _conninfo_utils.py
|   |   |       |   |   _copy.py
|   |   |       |   |   _copy_async.py
|   |   |       |   |   _copy_base.py
|   |   |       |   |   _cursor_base.py
|   |   |       |   |   _dns.py
|   |   |       |   |   _encodings.py
|   |   |       |   |   _enums.py
|   |   |       |   |   _oids.py
|   |   |       |   |   _pipeline.py
|   |   |       |   |   _preparing.py
|   |   |       |   |   _py_transformer.py
|   |   |       |   |   _queries.py
|   |   |       |   |   _struct.py
|   |   |       |   |   _tpc.py
|   |   |       |   |   _transformer.py
|   |   |       |   |   _typeinfo.py
|   |   |       |   |   _typemod.py
|   |   |       |   |   _tz.py
|   |   |       |   |   _wrappers.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   +---crdb
|   |   |       |   |   |   connection.py
|   |   |       |   |   |   _types.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           connection.cpython-312.pyc
|   |   |       |   |           _types.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---pq
|   |   |       |   |   |   abc.py
|   |   |       |   |   |   misc.py
|   |   |       |   |   |   pq_ctypes.py
|   |   |       |   |   |   _debug.py
|   |   |       |   |   |   _enums.py
|   |   |       |   |   |   _pq_ctypes.py
|   |   |       |   |   |   _pq_ctypes.pyi
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           abc.cpython-312.pyc
|   |   |       |   |           misc.cpython-312.pyc
|   |   |       |   |           pq_ctypes.cpython-312.pyc
|   |   |       |   |           _debug.cpython-312.pyc
|   |   |       |   |           _enums.cpython-312.pyc
|   |   |       |   |           _pq_ctypes.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---types
|   |   |       |   |   |   array.py
|   |   |       |   |   |   bool.py
|   |   |       |   |   |   composite.py
|   |   |       |   |   |   datetime.py
|   |   |       |   |   |   enum.py
|   |   |       |   |   |   hstore.py
|   |   |       |   |   |   json.py
|   |   |       |   |   |   multirange.py
|   |   |       |   |   |   net.py
|   |   |       |   |   |   none.py
|   |   |       |   |   |   numeric.py
|   |   |       |   |   |   numpy.py
|   |   |       |   |   |   range.py
|   |   |       |   |   |   shapely.py
|   |   |       |   |   |   string.py
|   |   |       |   |   |   uuid.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           array.cpython-312.pyc
|   |   |       |   |           bool.cpython-312.pyc
|   |   |       |   |           composite.cpython-312.pyc
|   |   |       |   |           datetime.cpython-312.pyc
|   |   |       |   |           enum.cpython-312.pyc
|   |   |       |   |           hstore.cpython-312.pyc
|   |   |       |   |           json.cpython-312.pyc
|   |   |       |   |           multirange.cpython-312.pyc
|   |   |       |   |           net.cpython-312.pyc
|   |   |       |   |           none.cpython-312.pyc
|   |   |       |   |           numeric.cpython-312.pyc
|   |   |       |   |           numpy.cpython-312.pyc
|   |   |       |   |           range.cpython-312.pyc
|   |   |       |   |           shapely.cpython-312.pyc
|   |   |       |   |           string.cpython-312.pyc
|   |   |       |   |           uuid.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   \---__pycache__
|   |   |       |           abc.cpython-312.pyc
|   |   |       |           adapt.cpython-312.pyc
|   |   |       |           client_cursor.cpython-312.pyc
|   |   |       |           connection.cpython-312.pyc
|   |   |       |           connection_async.cpython-312.pyc
|   |   |       |           conninfo.cpython-312.pyc
|   |   |       |           copy.cpython-312.pyc
|   |   |       |           cursor.cpython-312.pyc
|   |   |       |           cursor_async.cpython-312.pyc
|   |   |       |           dbapi20.cpython-312.pyc
|   |   |       |           errors.cpython-312.pyc
|   |   |       |           generators.cpython-312.pyc
|   |   |       |           postgres.cpython-312.pyc
|   |   |       |           raw_cursor.cpython-312.pyc
|   |   |       |           rows.cpython-312.pyc
|   |   |       |           server_cursor.cpython-312.pyc
|   |   |       |           sql.cpython-312.pyc
|   |   |       |           transaction.cpython-312.pyc
|   |   |       |           version.cpython-312.pyc
|   |   |       |           waiting.cpython-312.pyc
|   |   |       |           _acompat.cpython-312.pyc
|   |   |       |           _adapters_map.cpython-312.pyc
|   |   |       |           _capabilities.cpython-312.pyc
|   |   |       |           _cmodule.cpython-312.pyc
|   |   |       |           _column.cpython-312.pyc
|   |   |       |           _compat.cpython-312.pyc
|   |   |       |           _connection_base.cpython-312.pyc
|   |   |       |           _connection_info.cpython-312.pyc
|   |   |       |           _conninfo_attempts.cpython-312.pyc
|   |   |       |           _conninfo_attempts_async.cpython-312.pyc
|   |   |       |           _conninfo_utils.cpython-312.pyc
|   |   |       |           _copy.cpython-312.pyc
|   |   |       |           _copy_async.cpython-312.pyc
|   |   |       |           _copy_base.cpython-312.pyc
|   |   |       |           _cursor_base.cpython-312.pyc
|   |   |       |           _dns.cpython-312.pyc
|   |   |       |           _encodings.cpython-312.pyc
|   |   |       |           _enums.cpython-312.pyc
|   |   |       |           _oids.cpython-312.pyc
|   |   |       |           _pipeline.cpython-312.pyc
|   |   |       |           _preparing.cpython-312.pyc
|   |   |       |           _py_transformer.cpython-312.pyc
|   |   |       |           _queries.cpython-312.pyc
|   |   |       |           _struct.cpython-312.pyc
|   |   |       |           _tpc.cpython-312.pyc
|   |   |       |           _transformer.cpython-312.pyc
|   |   |       |           _typeinfo.cpython-312.pyc
|   |   |       |           _typemod.cpython-312.pyc
|   |   |       |           _tz.cpython-312.pyc
|   |   |       |           _wrappers.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---psycopg-3.2.1.dist-info
|   |   |       |       INSTALLER
|   |   |       |       LICENSE.txt
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       REQUESTED
|   |   |       |       top_level.txt
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---psycopg_binary
|   |   |       |   |   pq.cp312-win_amd64.pyd
|   |   |       |   |   py.typed
|   |   |       |   |   version.py
|   |   |       |   |   _psycopg.cp312-win_amd64.pyd
|   |   |       |   |   _psycopg.pyi
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   \---__pycache__
|   |   |       |           version.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---psycopg_binary-3.2.1.dist-info
|   |   |       |       DELVEWHEEL
|   |   |       |       INSTALLER
|   |   |       |       LICENSE.txt
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       top_level.txt
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---psycopg_binary.libs
|   |   |       |       libcrypto-1_1-x64-15ec4b7b2d8017a72acf488cff1a1c38.dll
|   |   |       |       libiconv-2.dll
|   |   |       |       libintl-9-6b2fa35014185f5e79c4c76df54d19ae.dll
|   |   |       |       libpq-de0d6d7eef3cda3760db155fac0f1d34.dll
|   |   |       |       libssl-1_1-x64-56850767f4919548e5b00c9d311d045e.dll
|   |   |       |       libwinpthread-1.dll
|   |   |       |       
|   |   |       +---python_dotenv-1.0.1.dist-info
|   |   |       |       entry_points.txt
|   |   |       |       INSTALLER
|   |   |       |       LICENSE
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       REQUESTED
|   |   |       |       top_level.txt
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---sqlalchemy
|   |   |       |   |   events.py
|   |   |       |   |   exc.py
|   |   |       |   |   inspection.py
|   |   |       |   |   log.py
|   |   |       |   |   py.typed
|   |   |       |   |   schema.py
|   |   |       |   |   types.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   +---connectors
|   |   |       |   |   |   aioodbc.py
|   |   |       |   |   |   asyncio.py
|   |   |       |   |   |   pyodbc.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           aioodbc.cpython-312.pyc
|   |   |       |   |           asyncio.cpython-312.pyc
|   |   |       |   |           pyodbc.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---cyextension
|   |   |       |   |   |   collections.cp312-win_amd64.pyd
|   |   |       |   |   |   collections.pyx
|   |   |       |   |   |   immutabledict.cp312-win_amd64.pyd
|   |   |       |   |   |   immutabledict.pxd
|   |   |       |   |   |   immutabledict.pyx
|   |   |       |   |   |   processors.cp312-win_amd64.pyd
|   |   |       |   |   |   processors.pyx
|   |   |       |   |   |   resultproxy.cp312-win_amd64.pyd
|   |   |       |   |   |   resultproxy.pyx
|   |   |       |   |   |   util.cp312-win_amd64.pyd
|   |   |       |   |   |   util.pyx
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---dialects
|   |   |       |   |   |   type_migration_guidelines.txt
|   |   |       |   |   |   _typing.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   +---mssql
|   |   |       |   |   |   |   aioodbc.py
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   information_schema.py
|   |   |       |   |   |   |   json.py
|   |   |       |   |   |   |   provision.py
|   |   |       |   |   |   |   pymssql.py
|   |   |       |   |   |   |   pyodbc.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           aioodbc.cpython-312.pyc
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           information_schema.cpython-312.pyc
|   |   |       |   |   |           json.cpython-312.pyc
|   |   |       |   |   |           provision.cpython-312.pyc
|   |   |       |   |   |           pymssql.cpython-312.pyc
|   |   |       |   |   |           pyodbc.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---mysql
|   |   |       |   |   |   |   aiomysql.py
|   |   |       |   |   |   |   asyncmy.py
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   cymysql.py
|   |   |       |   |   |   |   dml.py
|   |   |       |   |   |   |   enumerated.py
|   |   |       |   |   |   |   expression.py
|   |   |       |   |   |   |   json.py
|   |   |       |   |   |   |   mariadb.py
|   |   |       |   |   |   |   mariadbconnector.py
|   |   |       |   |   |   |   mysqlconnector.py
|   |   |       |   |   |   |   mysqldb.py
|   |   |       |   |   |   |   provision.py
|   |   |       |   |   |   |   pymysql.py
|   |   |       |   |   |   |   pyodbc.py
|   |   |       |   |   |   |   reflection.py
|   |   |       |   |   |   |   reserved_words.py
|   |   |       |   |   |   |   types.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           aiomysql.cpython-312.pyc
|   |   |       |   |   |           asyncmy.cpython-312.pyc
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           cymysql.cpython-312.pyc
|   |   |       |   |   |           dml.cpython-312.pyc
|   |   |       |   |   |           enumerated.cpython-312.pyc
|   |   |       |   |   |           expression.cpython-312.pyc
|   |   |       |   |   |           json.cpython-312.pyc
|   |   |       |   |   |           mariadb.cpython-312.pyc
|   |   |       |   |   |           mariadbconnector.cpython-312.pyc
|   |   |       |   |   |           mysqlconnector.cpython-312.pyc
|   |   |       |   |   |           mysqldb.cpython-312.pyc
|   |   |       |   |   |           provision.cpython-312.pyc
|   |   |       |   |   |           pymysql.cpython-312.pyc
|   |   |       |   |   |           pyodbc.cpython-312.pyc
|   |   |       |   |   |           reflection.cpython-312.pyc
|   |   |       |   |   |           reserved_words.cpython-312.pyc
|   |   |       |   |   |           types.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---oracle
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   cx_oracle.py
|   |   |       |   |   |   |   dictionary.py
|   |   |       |   |   |   |   oracledb.py
|   |   |       |   |   |   |   provision.py
|   |   |       |   |   |   |   types.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           cx_oracle.cpython-312.pyc
|   |   |       |   |   |           dictionary.cpython-312.pyc
|   |   |       |   |   |           oracledb.cpython-312.pyc
|   |   |       |   |   |           provision.cpython-312.pyc
|   |   |       |   |   |           types.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---postgresql
|   |   |       |   |   |   |   array.py
|   |   |       |   |   |   |   asyncpg.py
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   dml.py
|   |   |       |   |   |   |   ext.py
|   |   |       |   |   |   |   hstore.py
|   |   |       |   |   |   |   json.py
|   |   |       |   |   |   |   named_types.py
|   |   |       |   |   |   |   operators.py
|   |   |       |   |   |   |   pg8000.py
|   |   |       |   |   |   |   pg_catalog.py
|   |   |       |   |   |   |   provision.py
|   |   |       |   |   |   |   psycopg.py
|   |   |       |   |   |   |   psycopg2.py
|   |   |       |   |   |   |   psycopg2cffi.py
|   |   |       |   |   |   |   ranges.py
|   |   |       |   |   |   |   types.py
|   |   |       |   |   |   |   _psycopg_common.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           array.cpython-312.pyc
|   |   |       |   |   |           asyncpg.cpython-312.pyc
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           dml.cpython-312.pyc
|   |   |       |   |   |           ext.cpython-312.pyc
|   |   |       |   |   |           hstore.cpython-312.pyc
|   |   |       |   |   |           json.cpython-312.pyc
|   |   |       |   |   |           named_types.cpython-312.pyc
|   |   |       |   |   |           operators.cpython-312.pyc
|   |   |       |   |   |           pg8000.cpython-312.pyc
|   |   |       |   |   |           pg_catalog.cpython-312.pyc
|   |   |       |   |   |           provision.cpython-312.pyc
|   |   |       |   |   |           psycopg.cpython-312.pyc
|   |   |       |   |   |           psycopg2.cpython-312.pyc
|   |   |       |   |   |           psycopg2cffi.cpython-312.pyc
|   |   |       |   |   |           ranges.cpython-312.pyc
|   |   |       |   |   |           types.cpython-312.pyc
|   |   |       |   |   |           _psycopg_common.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---sqlite
|   |   |       |   |   |   |   aiosqlite.py
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   dml.py
|   |   |       |   |   |   |   json.py
|   |   |       |   |   |   |   provision.py
|   |   |       |   |   |   |   pysqlcipher.py
|   |   |       |   |   |   |   pysqlite.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           aiosqlite.cpython-312.pyc
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           dml.cpython-312.pyc
|   |   |       |   |   |           json.cpython-312.pyc
|   |   |       |   |   |           provision.cpython-312.pyc
|   |   |       |   |   |           pysqlcipher.cpython-312.pyc
|   |   |       |   |   |           pysqlite.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   \---__pycache__
|   |   |       |   |           _typing.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---engine
|   |   |       |   |   |   base.py
|   |   |       |   |   |   characteristics.py
|   |   |       |   |   |   create.py
|   |   |       |   |   |   cursor.py
|   |   |       |   |   |   default.py
|   |   |       |   |   |   events.py
|   |   |       |   |   |   interfaces.py
|   |   |       |   |   |   mock.py
|   |   |       |   |   |   processors.py
|   |   |       |   |   |   reflection.py
|   |   |       |   |   |   result.py
|   |   |       |   |   |   row.py
|   |   |       |   |   |   strategies.py
|   |   |       |   |   |   url.py
|   |   |       |   |   |   util.py
|   |   |       |   |   |   _py_processors.py
|   |   |       |   |   |   _py_row.py
|   |   |       |   |   |   _py_util.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           base.cpython-312.pyc
|   |   |       |   |           characteristics.cpython-312.pyc
|   |   |       |   |           create.cpython-312.pyc
|   |   |       |   |           cursor.cpython-312.pyc
|   |   |       |   |           default.cpython-312.pyc
|   |   |       |   |           events.cpython-312.pyc
|   |   |       |   |           interfaces.cpython-312.pyc
|   |   |       |   |           mock.cpython-312.pyc
|   |   |       |   |           processors.cpython-312.pyc
|   |   |       |   |           reflection.cpython-312.pyc
|   |   |       |   |           result.cpython-312.pyc
|   |   |       |   |           row.cpython-312.pyc
|   |   |       |   |           strategies.cpython-312.pyc
|   |   |       |   |           url.cpython-312.pyc
|   |   |       |   |           util.cpython-312.pyc
|   |   |       |   |           _py_processors.cpython-312.pyc
|   |   |       |   |           _py_row.cpython-312.pyc
|   |   |       |   |           _py_util.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---event
|   |   |       |   |   |   api.py
|   |   |       |   |   |   attr.py
|   |   |       |   |   |   base.py
|   |   |       |   |   |   legacy.py
|   |   |       |   |   |   registry.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           api.cpython-312.pyc
|   |   |       |   |           attr.cpython-312.pyc
|   |   |       |   |           base.cpython-312.pyc
|   |   |       |   |           legacy.cpython-312.pyc
|   |   |       |   |           registry.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---ext
|   |   |       |   |   |   associationproxy.py
|   |   |       |   |   |   automap.py
|   |   |       |   |   |   baked.py
|   |   |       |   |   |   compiler.py
|   |   |       |   |   |   horizontal_shard.py
|   |   |       |   |   |   hybrid.py
|   |   |       |   |   |   indexable.py
|   |   |       |   |   |   instrumentation.py
|   |   |       |   |   |   mutable.py
|   |   |       |   |   |   orderinglist.py
|   |   |       |   |   |   serializer.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   +---asyncio
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   engine.py
|   |   |       |   |   |   |   exc.py
|   |   |       |   |   |   |   result.py
|   |   |       |   |   |   |   scoping.py
|   |   |       |   |   |   |   session.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           engine.cpython-312.pyc
|   |   |       |   |   |           exc.cpython-312.pyc
|   |   |       |   |   |           result.cpython-312.pyc
|   |   |       |   |   |           scoping.cpython-312.pyc
|   |   |       |   |   |           session.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---declarative
|   |   |       |   |   |   |   extensions.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           extensions.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---mypy
|   |   |       |   |   |   |   apply.py
|   |   |       |   |   |   |   decl_class.py
|   |   |       |   |   |   |   infer.py
|   |   |       |   |   |   |   names.py
|   |   |       |   |   |   |   plugin.py
|   |   |       |   |   |   |   util.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           apply.cpython-312.pyc
|   |   |       |   |   |           decl_class.cpython-312.pyc
|   |   |       |   |   |           infer.cpython-312.pyc
|   |   |       |   |   |           names.cpython-312.pyc
|   |   |       |   |   |           plugin.cpython-312.pyc
|   |   |       |   |   |           util.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   \---__pycache__
|   |   |       |   |           associationproxy.cpython-312.pyc
|   |   |       |   |           automap.cpython-312.pyc
|   |   |       |   |           baked.cpython-312.pyc
|   |   |       |   |           compiler.cpython-312.pyc
|   |   |       |   |           horizontal_shard.cpython-312.pyc
|   |   |       |   |           hybrid.cpython-312.pyc
|   |   |       |   |           indexable.cpython-312.pyc
|   |   |       |   |           instrumentation.cpython-312.pyc
|   |   |       |   |           mutable.cpython-312.pyc
|   |   |       |   |           orderinglist.cpython-312.pyc
|   |   |       |   |           serializer.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---future
|   |   |       |   |   |   engine.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           engine.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---orm
|   |   |       |   |   |   attributes.py
|   |   |       |   |   |   base.py
|   |   |       |   |   |   bulk_persistence.py
|   |   |       |   |   |   clsregistry.py
|   |   |       |   |   |   collections.py
|   |   |       |   |   |   context.py
|   |   |       |   |   |   decl_api.py
|   |   |       |   |   |   decl_base.py
|   |   |       |   |   |   dependency.py
|   |   |       |   |   |   descriptor_props.py
|   |   |       |   |   |   dynamic.py
|   |   |       |   |   |   evaluator.py
|   |   |       |   |   |   events.py
|   |   |       |   |   |   exc.py
|   |   |       |   |   |   identity.py
|   |   |       |   |   |   instrumentation.py
|   |   |       |   |   |   interfaces.py
|   |   |       |   |   |   loading.py
|   |   |       |   |   |   mapped_collection.py
|   |   |       |   |   |   mapper.py
|   |   |       |   |   |   path_registry.py
|   |   |       |   |   |   persistence.py
|   |   |       |   |   |   properties.py
|   |   |       |   |   |   query.py
|   |   |       |   |   |   relationships.py
|   |   |       |   |   |   scoping.py
|   |   |       |   |   |   session.py
|   |   |       |   |   |   state.py
|   |   |       |   |   |   state_changes.py
|   |   |       |   |   |   strategies.py
|   |   |       |   |   |   strategy_options.py
|   |   |       |   |   |   sync.py
|   |   |       |   |   |   unitofwork.py
|   |   |       |   |   |   util.py
|   |   |       |   |   |   writeonly.py
|   |   |       |   |   |   _orm_constructors.py
|   |   |       |   |   |   _typing.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           attributes.cpython-312.pyc
|   |   |       |   |           base.cpython-312.pyc
|   |   |       |   |           bulk_persistence.cpython-312.pyc
|   |   |       |   |           clsregistry.cpython-312.pyc
|   |   |       |   |           collections.cpython-312.pyc
|   |   |       |   |           context.cpython-312.pyc
|   |   |       |   |           decl_api.cpython-312.pyc
|   |   |       |   |           decl_base.cpython-312.pyc
|   |   |       |   |           dependency.cpython-312.pyc
|   |   |       |   |           descriptor_props.cpython-312.pyc
|   |   |       |   |           dynamic.cpython-312.pyc
|   |   |       |   |           evaluator.cpython-312.pyc
|   |   |       |   |           events.cpython-312.pyc
|   |   |       |   |           exc.cpython-312.pyc
|   |   |       |   |           identity.cpython-312.pyc
|   |   |       |   |           instrumentation.cpython-312.pyc
|   |   |       |   |           interfaces.cpython-312.pyc
|   |   |       |   |           loading.cpython-312.pyc
|   |   |       |   |           mapped_collection.cpython-312.pyc
|   |   |       |   |           mapper.cpython-312.pyc
|   |   |       |   |           path_registry.cpython-312.pyc
|   |   |       |   |           persistence.cpython-312.pyc
|   |   |       |   |           properties.cpython-312.pyc
|   |   |       |   |           query.cpython-312.pyc
|   |   |       |   |           relationships.cpython-312.pyc
|   |   |       |   |           scoping.cpython-312.pyc
|   |   |       |   |           session.cpython-312.pyc
|   |   |       |   |           state.cpython-312.pyc
|   |   |       |   |           state_changes.cpython-312.pyc
|   |   |       |   |           strategies.cpython-312.pyc
|   |   |       |   |           strategy_options.cpython-312.pyc
|   |   |       |   |           sync.cpython-312.pyc
|   |   |       |   |           unitofwork.cpython-312.pyc
|   |   |       |   |           util.cpython-312.pyc
|   |   |       |   |           writeonly.cpython-312.pyc
|   |   |       |   |           _orm_constructors.cpython-312.pyc
|   |   |       |   |           _typing.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---pool
|   |   |       |   |   |   base.py
|   |   |       |   |   |   events.py
|   |   |       |   |   |   impl.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           base.cpython-312.pyc
|   |   |       |   |           events.cpython-312.pyc
|   |   |       |   |           impl.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---sql
|   |   |       |   |   |   annotation.py
|   |   |       |   |   |   base.py
|   |   |       |   |   |   cache_key.py
|   |   |       |   |   |   coercions.py
|   |   |       |   |   |   compiler.py
|   |   |       |   |   |   crud.py
|   |   |       |   |   |   ddl.py
|   |   |       |   |   |   default_comparator.py
|   |   |       |   |   |   dml.py
|   |   |       |   |   |   elements.py
|   |   |       |   |   |   events.py
|   |   |       |   |   |   expression.py
|   |   |       |   |   |   functions.py
|   |   |       |   |   |   lambdas.py
|   |   |       |   |   |   naming.py
|   |   |       |   |   |   operators.py
|   |   |       |   |   |   roles.py
|   |   |       |   |   |   schema.py
|   |   |       |   |   |   selectable.py
|   |   |       |   |   |   sqltypes.py
|   |   |       |   |   |   traversals.py
|   |   |       |   |   |   type_api.py
|   |   |       |   |   |   util.py
|   |   |       |   |   |   visitors.py
|   |   |       |   |   |   _dml_constructors.py
|   |   |       |   |   |   _elements_constructors.py
|   |   |       |   |   |   _orm_types.py
|   |   |       |   |   |   _py_util.py
|   |   |       |   |   |   _selectable_constructors.py
|   |   |       |   |   |   _typing.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           annotation.cpython-312.pyc
|   |   |       |   |           base.cpython-312.pyc
|   |   |       |   |           cache_key.cpython-312.pyc
|   |   |       |   |           coercions.cpython-312.pyc
|   |   |       |   |           compiler.cpython-312.pyc
|   |   |       |   |           crud.cpython-312.pyc
|   |   |       |   |           ddl.cpython-312.pyc
|   |   |       |   |           default_comparator.cpython-312.pyc
|   |   |       |   |           dml.cpython-312.pyc
|   |   |       |   |           elements.cpython-312.pyc
|   |   |       |   |           events.cpython-312.pyc
|   |   |       |   |           expression.cpython-312.pyc
|   |   |       |   |           functions.cpython-312.pyc
|   |   |       |   |           lambdas.cpython-312.pyc
|   |   |       |   |           naming.cpython-312.pyc
|   |   |       |   |           operators.cpython-312.pyc
|   |   |       |   |           roles.cpython-312.pyc
|   |   |       |   |           schema.cpython-312.pyc
|   |   |       |   |           selectable.cpython-312.pyc
|   |   |       |   |           sqltypes.cpython-312.pyc
|   |   |       |   |           traversals.cpython-312.pyc
|   |   |       |   |           type_api.cpython-312.pyc
|   |   |       |   |           util.cpython-312.pyc
|   |   |       |   |           visitors.cpython-312.pyc
|   |   |       |   |           _dml_constructors.cpython-312.pyc
|   |   |       |   |           _elements_constructors.cpython-312.pyc
|   |   |       |   |           _orm_types.cpython-312.pyc
|   |   |       |   |           _py_util.cpython-312.pyc
|   |   |       |   |           _selectable_constructors.cpython-312.pyc
|   |   |       |   |           _typing.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---testing
|   |   |       |   |   |   assertions.py
|   |   |       |   |   |   assertsql.py
|   |   |       |   |   |   asyncio.py
|   |   |       |   |   |   config.py
|   |   |       |   |   |   engines.py
|   |   |       |   |   |   entities.py
|   |   |       |   |   |   exclusions.py
|   |   |       |   |   |   pickleable.py
|   |   |       |   |   |   profiling.py
|   |   |       |   |   |   provision.py
|   |   |       |   |   |   requirements.py
|   |   |       |   |   |   schema.py
|   |   |       |   |   |   util.py
|   |   |       |   |   |   warnings.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   +---fixtures
|   |   |       |   |   |   |   base.py
|   |   |       |   |   |   |   mypy.py
|   |   |       |   |   |   |   orm.py
|   |   |       |   |   |   |   sql.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           base.cpython-312.pyc
|   |   |       |   |   |           mypy.cpython-312.pyc
|   |   |       |   |   |           orm.cpython-312.pyc
|   |   |       |   |   |           sql.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---plugin
|   |   |       |   |   |   |   bootstrap.py
|   |   |       |   |   |   |   plugin_base.py
|   |   |       |   |   |   |   pytestplugin.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           bootstrap.cpython-312.pyc
|   |   |       |   |   |           plugin_base.cpython-312.pyc
|   |   |       |   |   |           pytestplugin.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---suite
|   |   |       |   |   |   |   test_cte.py
|   |   |       |   |   |   |   test_ddl.py
|   |   |       |   |   |   |   test_deprecations.py
|   |   |       |   |   |   |   test_dialect.py
|   |   |       |   |   |   |   test_insert.py
|   |   |       |   |   |   |   test_reflection.py
|   |   |       |   |   |   |   test_results.py
|   |   |       |   |   |   |   test_rowcount.py
|   |   |       |   |   |   |   test_select.py
|   |   |       |   |   |   |   test_sequence.py
|   |   |       |   |   |   |   test_types.py
|   |   |       |   |   |   |   test_unicode_ddl.py
|   |   |       |   |   |   |   test_update_delete.py
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           test_cte.cpython-312.pyc
|   |   |       |   |   |           test_ddl.cpython-312.pyc
|   |   |       |   |   |           test_deprecations.cpython-312.pyc
|   |   |       |   |   |           test_dialect.cpython-312.pyc
|   |   |       |   |   |           test_insert.cpython-312.pyc
|   |   |       |   |   |           test_reflection.cpython-312.pyc
|   |   |       |   |   |           test_results.cpython-312.pyc
|   |   |       |   |   |           test_rowcount.cpython-312.pyc
|   |   |       |   |   |           test_select.cpython-312.pyc
|   |   |       |   |   |           test_sequence.cpython-312.pyc
|   |   |       |   |   |           test_types.cpython-312.pyc
|   |   |       |   |   |           test_unicode_ddl.cpython-312.pyc
|   |   |       |   |   |           test_update_delete.cpython-312.pyc
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   \---__pycache__
|   |   |       |   |           assertions.cpython-312.pyc
|   |   |       |   |           assertsql.cpython-312.pyc
|   |   |       |   |           asyncio.cpython-312.pyc
|   |   |       |   |           config.cpython-312.pyc
|   |   |       |   |           engines.cpython-312.pyc
|   |   |       |   |           entities.cpython-312.pyc
|   |   |       |   |           exclusions.cpython-312.pyc
|   |   |       |   |           pickleable.cpython-312.pyc
|   |   |       |   |           profiling.cpython-312.pyc
|   |   |       |   |           provision.cpython-312.pyc
|   |   |       |   |           requirements.cpython-312.pyc
|   |   |       |   |           schema.cpython-312.pyc
|   |   |       |   |           util.cpython-312.pyc
|   |   |       |   |           warnings.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---util
|   |   |       |   |   |   compat.py
|   |   |       |   |   |   concurrency.py
|   |   |       |   |   |   deprecations.py
|   |   |       |   |   |   langhelpers.py
|   |   |       |   |   |   preloaded.py
|   |   |       |   |   |   queue.py
|   |   |       |   |   |   tool_support.py
|   |   |       |   |   |   topological.py
|   |   |       |   |   |   typing.py
|   |   |       |   |   |   _collections.py
|   |   |       |   |   |   _concurrency_py3k.py
|   |   |       |   |   |   _has_cy.py
|   |   |       |   |   |   _py_collections.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           compat.cpython-312.pyc
|   |   |       |   |           concurrency.cpython-312.pyc
|   |   |       |   |           deprecations.cpython-312.pyc
|   |   |       |   |           langhelpers.cpython-312.pyc
|   |   |       |   |           preloaded.cpython-312.pyc
|   |   |       |   |           queue.cpython-312.pyc
|   |   |       |   |           tool_support.cpython-312.pyc
|   |   |       |   |           topological.cpython-312.pyc
|   |   |       |   |           typing.cpython-312.pyc
|   |   |       |   |           _collections.cpython-312.pyc
|   |   |       |   |           _concurrency_py3k.cpython-312.pyc
|   |   |       |   |           _has_cy.cpython-312.pyc
|   |   |       |   |           _py_collections.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   \---__pycache__
|   |   |       |           events.cpython-312.pyc
|   |   |       |           exc.cpython-312.pyc
|   |   |       |           inspection.cpython-312.pyc
|   |   |       |           log.cpython-312.pyc
|   |   |       |           schema.cpython-312.pyc
|   |   |       |           types.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---SQLAlchemy-2.0.32.dist-info
|   |   |       |       INSTALLER
|   |   |       |       LICENSE
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       REQUESTED
|   |   |       |       top_level.txt
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       +---typing_extensions-4.15.0.dist-info
|   |   |       |   |   INSTALLER
|   |   |       |   |   METADATA
|   |   |       |   |   RECORD
|   |   |       |   |   WHEEL
|   |   |       |   |   
|   |   |       |   \---licenses
|   |   |       |           LICENSE
|   |   |       |           
|   |   |       +---tzdata
|   |   |       |   |   zones
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   +---zoneinfo
|   |   |       |   |   |   CET
|   |   |       |   |   |   CST6CDT
|   |   |       |   |   |   Cuba
|   |   |       |   |   |   EET
|   |   |       |   |   |   Egypt
|   |   |       |   |   |   Eire
|   |   |       |   |   |   EST
|   |   |       |   |   |   EST5EDT
|   |   |       |   |   |   Factory
|   |   |       |   |   |   GB
|   |   |       |   |   |   GB-Eire
|   |   |       |   |   |   GMT
|   |   |       |   |   |   GMT+0
|   |   |       |   |   |   GMT-0
|   |   |       |   |   |   GMT0
|   |   |       |   |   |   Greenwich
|   |   |       |   |   |   Hongkong
|   |   |       |   |   |   HST
|   |   |       |   |   |   Iceland
|   |   |       |   |   |   Iran
|   |   |       |   |   |   iso3166.tab
|   |   |       |   |   |   Israel
|   |   |       |   |   |   Jamaica
|   |   |       |   |   |   Japan
|   |   |       |   |   |   Kwajalein
|   |   |       |   |   |   leapseconds
|   |   |       |   |   |   Libya
|   |   |       |   |   |   MET
|   |   |       |   |   |   MST
|   |   |       |   |   |   MST7MDT
|   |   |       |   |   |   Navajo
|   |   |       |   |   |   NZ
|   |   |       |   |   |   NZ-CHAT
|   |   |       |   |   |   Poland
|   |   |       |   |   |   Portugal
|   |   |       |   |   |   PRC
|   |   |       |   |   |   PST8PDT
|   |   |       |   |   |   ROC
|   |   |       |   |   |   ROK
|   |   |       |   |   |   Singapore
|   |   |       |   |   |   Turkey
|   |   |       |   |   |   tzdata.zi
|   |   |       |   |   |   UCT
|   |   |       |   |   |   Universal
|   |   |       |   |   |   UTC
|   |   |       |   |   |   W-SU
|   |   |       |   |   |   WET
|   |   |       |   |   |   zone.tab
|   |   |       |   |   |   zone1970.tab
|   |   |       |   |   |   zonenow.tab
|   |   |       |   |   |   Zulu
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   +---Africa
|   |   |       |   |   |   |   Abidjan
|   |   |       |   |   |   |   Accra
|   |   |       |   |   |   |   Addis_Ababa
|   |   |       |   |   |   |   Algiers
|   |   |       |   |   |   |   Asmara
|   |   |       |   |   |   |   Asmera
|   |   |       |   |   |   |   Bamako
|   |   |       |   |   |   |   Bangui
|   |   |       |   |   |   |   Banjul
|   |   |       |   |   |   |   Bissau
|   |   |       |   |   |   |   Blantyre
|   |   |       |   |   |   |   Brazzaville
|   |   |       |   |   |   |   Bujumbura
|   |   |       |   |   |   |   Cairo
|   |   |       |   |   |   |   Casablanca
|   |   |       |   |   |   |   Ceuta
|   |   |       |   |   |   |   Conakry
|   |   |       |   |   |   |   Dakar
|   |   |       |   |   |   |   Dar_es_Salaam
|   |   |       |   |   |   |   Djibouti
|   |   |       |   |   |   |   Douala
|   |   |       |   |   |   |   El_Aaiun
|   |   |       |   |   |   |   Freetown
|   |   |       |   |   |   |   Gaborone
|   |   |       |   |   |   |   Harare
|   |   |       |   |   |   |   Johannesburg
|   |   |       |   |   |   |   Juba
|   |   |       |   |   |   |   Kampala
|   |   |       |   |   |   |   Khartoum
|   |   |       |   |   |   |   Kigali
|   |   |       |   |   |   |   Kinshasa
|   |   |       |   |   |   |   Lagos
|   |   |       |   |   |   |   Libreville
|   |   |       |   |   |   |   Lome
|   |   |       |   |   |   |   Luanda
|   |   |       |   |   |   |   Lubumbashi
|   |   |       |   |   |   |   Lusaka
|   |   |       |   |   |   |   Malabo
|   |   |       |   |   |   |   Maputo
|   |   |       |   |   |   |   Maseru
|   |   |       |   |   |   |   Mbabane
|   |   |       |   |   |   |   Mogadishu
|   |   |       |   |   |   |   Monrovia
|   |   |       |   |   |   |   Nairobi
|   |   |       |   |   |   |   Ndjamena
|   |   |       |   |   |   |   Niamey
|   |   |       |   |   |   |   Nouakchott
|   |   |       |   |   |   |   Ouagadougou
|   |   |       |   |   |   |   Porto-Novo
|   |   |       |   |   |   |   Sao_Tome
|   |   |       |   |   |   |   Timbuktu
|   |   |       |   |   |   |   Tripoli
|   |   |       |   |   |   |   Tunis
|   |   |       |   |   |   |   Windhoek
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---America
|   |   |       |   |   |   |   Adak
|   |   |       |   |   |   |   Anchorage
|   |   |       |   |   |   |   Anguilla
|   |   |       |   |   |   |   Antigua
|   |   |       |   |   |   |   Araguaina
|   |   |       |   |   |   |   Aruba
|   |   |       |   |   |   |   Asuncion
|   |   |       |   |   |   |   Atikokan
|   |   |       |   |   |   |   Atka
|   |   |       |   |   |   |   Bahia
|   |   |       |   |   |   |   Bahia_Banderas
|   |   |       |   |   |   |   Barbados
|   |   |       |   |   |   |   Belem
|   |   |       |   |   |   |   Belize
|   |   |       |   |   |   |   Blanc-Sablon
|   |   |       |   |   |   |   Boa_Vista
|   |   |       |   |   |   |   Bogota
|   |   |       |   |   |   |   Boise
|   |   |       |   |   |   |   Buenos_Aires
|   |   |       |   |   |   |   Cambridge_Bay
|   |   |       |   |   |   |   Campo_Grande
|   |   |       |   |   |   |   Cancun
|   |   |       |   |   |   |   Caracas
|   |   |       |   |   |   |   Catamarca
|   |   |       |   |   |   |   Cayenne
|   |   |       |   |   |   |   Cayman
|   |   |       |   |   |   |   Chicago
|   |   |       |   |   |   |   Chihuahua
|   |   |       |   |   |   |   Ciudad_Juarez
|   |   |       |   |   |   |   Coral_Harbour
|   |   |       |   |   |   |   Cordoba
|   |   |       |   |   |   |   Costa_Rica
|   |   |       |   |   |   |   Coyhaique
|   |   |       |   |   |   |   Creston
|   |   |       |   |   |   |   Cuiaba
|   |   |       |   |   |   |   Curacao
|   |   |       |   |   |   |   Danmarkshavn
|   |   |       |   |   |   |   Dawson
|   |   |       |   |   |   |   Dawson_Creek
|   |   |       |   |   |   |   Denver
|   |   |       |   |   |   |   Detroit
|   |   |       |   |   |   |   Dominica
|   |   |       |   |   |   |   Edmonton
|   |   |       |   |   |   |   Eirunepe
|   |   |       |   |   |   |   El_Salvador
|   |   |       |   |   |   |   Ensenada
|   |   |       |   |   |   |   Fortaleza
|   |   |       |   |   |   |   Fort_Nelson
|   |   |       |   |   |   |   Fort_Wayne
|   |   |       |   |   |   |   Glace_Bay
|   |   |       |   |   |   |   Godthab
|   |   |       |   |   |   |   Goose_Bay
|   |   |       |   |   |   |   Grand_Turk
|   |   |       |   |   |   |   Grenada
|   |   |       |   |   |   |   Guadeloupe
|   |   |       |   |   |   |   Guatemala
|   |   |       |   |   |   |   Guayaquil
|   |   |       |   |   |   |   Guyana
|   |   |       |   |   |   |   Halifax
|   |   |       |   |   |   |   Havana
|   |   |       |   |   |   |   Hermosillo
|   |   |       |   |   |   |   Indianapolis
|   |   |       |   |   |   |   Inuvik
|   |   |       |   |   |   |   Iqaluit
|   |   |       |   |   |   |   Jamaica
|   |   |       |   |   |   |   Jujuy
|   |   |       |   |   |   |   Juneau
|   |   |       |   |   |   |   Knox_IN
|   |   |       |   |   |   |   Kralendijk
|   |   |       |   |   |   |   La_Paz
|   |   |       |   |   |   |   Lima
|   |   |       |   |   |   |   Los_Angeles
|   |   |       |   |   |   |   Louisville
|   |   |       |   |   |   |   Lower_Princes
|   |   |       |   |   |   |   Maceio
|   |   |       |   |   |   |   Managua
|   |   |       |   |   |   |   Manaus
|   |   |       |   |   |   |   Marigot
|   |   |       |   |   |   |   Martinique
|   |   |       |   |   |   |   Matamoros
|   |   |       |   |   |   |   Mazatlan
|   |   |       |   |   |   |   Mendoza
|   |   |       |   |   |   |   Menominee
|   |   |       |   |   |   |   Merida
|   |   |       |   |   |   |   Metlakatla
|   |   |       |   |   |   |   Mexico_City
|   |   |       |   |   |   |   Miquelon
|   |   |       |   |   |   |   Moncton
|   |   |       |   |   |   |   Monterrey
|   |   |       |   |   |   |   Montevideo
|   |   |       |   |   |   |   Montreal
|   |   |       |   |   |   |   Montserrat
|   |   |       |   |   |   |   Nassau
|   |   |       |   |   |   |   New_York
|   |   |       |   |   |   |   Nipigon
|   |   |       |   |   |   |   Nome
|   |   |       |   |   |   |   Noronha
|   |   |       |   |   |   |   Nuuk
|   |   |       |   |   |   |   Ojinaga
|   |   |       |   |   |   |   Panama
|   |   |       |   |   |   |   Pangnirtung
|   |   |       |   |   |   |   Paramaribo
|   |   |       |   |   |   |   Phoenix
|   |   |       |   |   |   |   Port-au-Prince
|   |   |       |   |   |   |   Porto_Acre
|   |   |       |   |   |   |   Porto_Velho
|   |   |       |   |   |   |   Port_of_Spain
|   |   |       |   |   |   |   Puerto_Rico
|   |   |       |   |   |   |   Punta_Arenas
|   |   |       |   |   |   |   Rainy_River
|   |   |       |   |   |   |   Rankin_Inlet
|   |   |       |   |   |   |   Recife
|   |   |       |   |   |   |   Regina
|   |   |       |   |   |   |   Resolute
|   |   |       |   |   |   |   Rio_Branco
|   |   |       |   |   |   |   Rosario
|   |   |       |   |   |   |   Santarem
|   |   |       |   |   |   |   Santa_Isabel
|   |   |       |   |   |   |   Santiago
|   |   |       |   |   |   |   Santo_Domingo
|   |   |       |   |   |   |   Sao_Paulo
|   |   |       |   |   |   |   Scoresbysund
|   |   |       |   |   |   |   Shiprock
|   |   |       |   |   |   |   Sitka
|   |   |       |   |   |   |   St_Barthelemy
|   |   |       |   |   |   |   St_Johns
|   |   |       |   |   |   |   St_Kitts
|   |   |       |   |   |   |   St_Lucia
|   |   |       |   |   |   |   St_Thomas
|   |   |       |   |   |   |   St_Vincent
|   |   |       |   |   |   |   Swift_Current
|   |   |       |   |   |   |   Tegucigalpa
|   |   |       |   |   |   |   Thule
|   |   |       |   |   |   |   Thunder_Bay
|   |   |       |   |   |   |   Tijuana
|   |   |       |   |   |   |   Toronto
|   |   |       |   |   |   |   Tortola
|   |   |       |   |   |   |   Vancouver
|   |   |       |   |   |   |   Virgin
|   |   |       |   |   |   |   Whitehorse
|   |   |       |   |   |   |   Winnipeg
|   |   |       |   |   |   |   Yakutat
|   |   |       |   |   |   |   Yellowknife
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   +---Argentina
|   |   |       |   |   |   |   |   Buenos_Aires
|   |   |       |   |   |   |   |   Catamarca
|   |   |       |   |   |   |   |   ComodRivadavia
|   |   |       |   |   |   |   |   Cordoba
|   |   |       |   |   |   |   |   Jujuy
|   |   |       |   |   |   |   |   La_Rioja
|   |   |       |   |   |   |   |   Mendoza
|   |   |       |   |   |   |   |   Rio_Gallegos
|   |   |       |   |   |   |   |   Salta
|   |   |       |   |   |   |   |   San_Juan
|   |   |       |   |   |   |   |   San_Luis
|   |   |       |   |   |   |   |   Tucuman
|   |   |       |   |   |   |   |   Ushuaia
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   +---Indiana
|   |   |       |   |   |   |   |   Indianapolis
|   |   |       |   |   |   |   |   Knox
|   |   |       |   |   |   |   |   Marengo
|   |   |       |   |   |   |   |   Petersburg
|   |   |       |   |   |   |   |   Tell_City
|   |   |       |   |   |   |   |   Vevay
|   |   |       |   |   |   |   |   Vincennes
|   |   |       |   |   |   |   |   Winamac
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   +---Kentucky
|   |   |       |   |   |   |   |   Louisville
|   |   |       |   |   |   |   |   Monticello
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   +---North_Dakota
|   |   |       |   |   |   |   |   Beulah
|   |   |       |   |   |   |   |   Center
|   |   |       |   |   |   |   |   New_Salem
|   |   |       |   |   |   |   |   __init__.py
|   |   |       |   |   |   |   |   
|   |   |       |   |   |   |   \---__pycache__
|   |   |       |   |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |   |           
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Antarctica
|   |   |       |   |   |   |   Casey
|   |   |       |   |   |   |   Davis
|   |   |       |   |   |   |   DumontDUrville
|   |   |       |   |   |   |   Macquarie
|   |   |       |   |   |   |   Mawson
|   |   |       |   |   |   |   McMurdo
|   |   |       |   |   |   |   Palmer
|   |   |       |   |   |   |   Rothera
|   |   |       |   |   |   |   South_Pole
|   |   |       |   |   |   |   Syowa
|   |   |       |   |   |   |   Troll
|   |   |       |   |   |   |   Vostok
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Arctic
|   |   |       |   |   |   |   Longyearbyen
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Asia
|   |   |       |   |   |   |   Aden
|   |   |       |   |   |   |   Almaty
|   |   |       |   |   |   |   Amman
|   |   |       |   |   |   |   Anadyr
|   |   |       |   |   |   |   Aqtau
|   |   |       |   |   |   |   Aqtobe
|   |   |       |   |   |   |   Ashgabat
|   |   |       |   |   |   |   Ashkhabad
|   |   |       |   |   |   |   Atyrau
|   |   |       |   |   |   |   Baghdad
|   |   |       |   |   |   |   Bahrain
|   |   |       |   |   |   |   Baku
|   |   |       |   |   |   |   Bangkok
|   |   |       |   |   |   |   Barnaul
|   |   |       |   |   |   |   Beirut
|   |   |       |   |   |   |   Bishkek
|   |   |       |   |   |   |   Brunei
|   |   |       |   |   |   |   Calcutta
|   |   |       |   |   |   |   Chita
|   |   |       |   |   |   |   Choibalsan
|   |   |       |   |   |   |   Chongqing
|   |   |       |   |   |   |   Chungking
|   |   |       |   |   |   |   Colombo
|   |   |       |   |   |   |   Dacca
|   |   |       |   |   |   |   Damascus
|   |   |       |   |   |   |   Dhaka
|   |   |       |   |   |   |   Dili
|   |   |       |   |   |   |   Dubai
|   |   |       |   |   |   |   Dushanbe
|   |   |       |   |   |   |   Famagusta
|   |   |       |   |   |   |   Gaza
|   |   |       |   |   |   |   Harbin
|   |   |       |   |   |   |   Hebron
|   |   |       |   |   |   |   Hong_Kong
|   |   |       |   |   |   |   Hovd
|   |   |       |   |   |   |   Ho_Chi_Minh
|   |   |       |   |   |   |   Irkutsk
|   |   |       |   |   |   |   Istanbul
|   |   |       |   |   |   |   Jakarta
|   |   |       |   |   |   |   Jayapura
|   |   |       |   |   |   |   Jerusalem
|   |   |       |   |   |   |   Kabul
|   |   |       |   |   |   |   Kamchatka
|   |   |       |   |   |   |   Karachi
|   |   |       |   |   |   |   Kashgar
|   |   |       |   |   |   |   Kathmandu
|   |   |       |   |   |   |   Katmandu
|   |   |       |   |   |   |   Khandyga
|   |   |       |   |   |   |   Kolkata
|   |   |       |   |   |   |   Krasnoyarsk
|   |   |       |   |   |   |   Kuala_Lumpur
|   |   |       |   |   |   |   Kuching
|   |   |       |   |   |   |   Kuwait
|   |   |       |   |   |   |   Macao
|   |   |       |   |   |   |   Macau
|   |   |       |   |   |   |   Magadan
|   |   |       |   |   |   |   Makassar
|   |   |       |   |   |   |   Manila
|   |   |       |   |   |   |   Muscat
|   |   |       |   |   |   |   Nicosia
|   |   |       |   |   |   |   Novokuznetsk
|   |   |       |   |   |   |   Novosibirsk
|   |   |       |   |   |   |   Omsk
|   |   |       |   |   |   |   Oral
|   |   |       |   |   |   |   Phnom_Penh
|   |   |       |   |   |   |   Pontianak
|   |   |       |   |   |   |   Pyongyang
|   |   |       |   |   |   |   Qatar
|   |   |       |   |   |   |   Qostanay
|   |   |       |   |   |   |   Qyzylorda
|   |   |       |   |   |   |   Rangoon
|   |   |       |   |   |   |   Riyadh
|   |   |       |   |   |   |   Saigon
|   |   |       |   |   |   |   Sakhalin
|   |   |       |   |   |   |   Samarkand
|   |   |       |   |   |   |   Seoul
|   |   |       |   |   |   |   Shanghai
|   |   |       |   |   |   |   Singapore
|   |   |       |   |   |   |   Srednekolymsk
|   |   |       |   |   |   |   Taipei
|   |   |       |   |   |   |   Tashkent
|   |   |       |   |   |   |   Tbilisi
|   |   |       |   |   |   |   Tehran
|   |   |       |   |   |   |   Tel_Aviv
|   |   |       |   |   |   |   Thimbu
|   |   |       |   |   |   |   Thimphu
|   |   |       |   |   |   |   Tokyo
|   |   |       |   |   |   |   Tomsk
|   |   |       |   |   |   |   Ujung_Pandang
|   |   |       |   |   |   |   Ulaanbaatar
|   |   |       |   |   |   |   Ulan_Bator
|   |   |       |   |   |   |   Urumqi
|   |   |       |   |   |   |   Ust-Nera
|   |   |       |   |   |   |   Vientiane
|   |   |       |   |   |   |   Vladivostok
|   |   |       |   |   |   |   Yakutsk
|   |   |       |   |   |   |   Yangon
|   |   |       |   |   |   |   Yekaterinburg
|   |   |       |   |   |   |   Yerevan
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Atlantic
|   |   |       |   |   |   |   Azores
|   |   |       |   |   |   |   Bermuda
|   |   |       |   |   |   |   Canary
|   |   |       |   |   |   |   Cape_Verde
|   |   |       |   |   |   |   Faeroe
|   |   |       |   |   |   |   Faroe
|   |   |       |   |   |   |   Jan_Mayen
|   |   |       |   |   |   |   Madeira
|   |   |       |   |   |   |   Reykjavik
|   |   |       |   |   |   |   South_Georgia
|   |   |       |   |   |   |   Stanley
|   |   |       |   |   |   |   St_Helena
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Australia
|   |   |       |   |   |   |   ACT
|   |   |       |   |   |   |   Adelaide
|   |   |       |   |   |   |   Brisbane
|   |   |       |   |   |   |   Broken_Hill
|   |   |       |   |   |   |   Canberra
|   |   |       |   |   |   |   Currie
|   |   |       |   |   |   |   Darwin
|   |   |       |   |   |   |   Eucla
|   |   |       |   |   |   |   Hobart
|   |   |       |   |   |   |   LHI
|   |   |       |   |   |   |   Lindeman
|   |   |       |   |   |   |   Lord_Howe
|   |   |       |   |   |   |   Melbourne
|   |   |       |   |   |   |   North
|   |   |       |   |   |   |   NSW
|   |   |       |   |   |   |   Perth
|   |   |       |   |   |   |   Queensland
|   |   |       |   |   |   |   South
|   |   |       |   |   |   |   Sydney
|   |   |       |   |   |   |   Tasmania
|   |   |       |   |   |   |   Victoria
|   |   |       |   |   |   |   West
|   |   |       |   |   |   |   Yancowinna
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Brazil
|   |   |       |   |   |   |   Acre
|   |   |       |   |   |   |   DeNoronha
|   |   |       |   |   |   |   East
|   |   |       |   |   |   |   West
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Canada
|   |   |       |   |   |   |   Atlantic
|   |   |       |   |   |   |   Central
|   |   |       |   |   |   |   Eastern
|   |   |       |   |   |   |   Mountain
|   |   |       |   |   |   |   Newfoundland
|   |   |       |   |   |   |   Pacific
|   |   |       |   |   |   |   Saskatchewan
|   |   |       |   |   |   |   Yukon
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Chile
|   |   |       |   |   |   |   Continental
|   |   |       |   |   |   |   EasterIsland
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Etc
|   |   |       |   |   |   |   GMT
|   |   |       |   |   |   |   GMT+0
|   |   |       |   |   |   |   GMT+1
|   |   |       |   |   |   |   GMT+10
|   |   |       |   |   |   |   GMT+11
|   |   |       |   |   |   |   GMT+12
|   |   |       |   |   |   |   GMT+2
|   |   |       |   |   |   |   GMT+3
|   |   |       |   |   |   |   GMT+4
|   |   |       |   |   |   |   GMT+5
|   |   |       |   |   |   |   GMT+6
|   |   |       |   |   |   |   GMT+7
|   |   |       |   |   |   |   GMT+8
|   |   |       |   |   |   |   GMT+9
|   |   |       |   |   |   |   GMT-0
|   |   |       |   |   |   |   GMT-1
|   |   |       |   |   |   |   GMT-10
|   |   |       |   |   |   |   GMT-11
|   |   |       |   |   |   |   GMT-12
|   |   |       |   |   |   |   GMT-13
|   |   |       |   |   |   |   GMT-14
|   |   |       |   |   |   |   GMT-2
|   |   |       |   |   |   |   GMT-3
|   |   |       |   |   |   |   GMT-4
|   |   |       |   |   |   |   GMT-5
|   |   |       |   |   |   |   GMT-6
|   |   |       |   |   |   |   GMT-7
|   |   |       |   |   |   |   GMT-8
|   |   |       |   |   |   |   GMT-9
|   |   |       |   |   |   |   GMT0
|   |   |       |   |   |   |   Greenwich
|   |   |       |   |   |   |   UCT
|   |   |       |   |   |   |   Universal
|   |   |       |   |   |   |   UTC
|   |   |       |   |   |   |   Zulu
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Europe
|   |   |       |   |   |   |   Amsterdam
|   |   |       |   |   |   |   Andorra
|   |   |       |   |   |   |   Astrakhan
|   |   |       |   |   |   |   Athens
|   |   |       |   |   |   |   Belfast
|   |   |       |   |   |   |   Belgrade
|   |   |       |   |   |   |   Berlin
|   |   |       |   |   |   |   Bratislava
|   |   |       |   |   |   |   Brussels
|   |   |       |   |   |   |   Bucharest
|   |   |       |   |   |   |   Budapest
|   |   |       |   |   |   |   Busingen
|   |   |       |   |   |   |   Chisinau
|   |   |       |   |   |   |   Copenhagen
|   |   |       |   |   |   |   Dublin
|   |   |       |   |   |   |   Gibraltar
|   |   |       |   |   |   |   Guernsey
|   |   |       |   |   |   |   Helsinki
|   |   |       |   |   |   |   Isle_of_Man
|   |   |       |   |   |   |   Istanbul
|   |   |       |   |   |   |   Jersey
|   |   |       |   |   |   |   Kaliningrad
|   |   |       |   |   |   |   Kiev
|   |   |       |   |   |   |   Kirov
|   |   |       |   |   |   |   Kyiv
|   |   |       |   |   |   |   Lisbon
|   |   |       |   |   |   |   Ljubljana
|   |   |       |   |   |   |   London
|   |   |       |   |   |   |   Luxembourg
|   |   |       |   |   |   |   Madrid
|   |   |       |   |   |   |   Malta
|   |   |       |   |   |   |   Mariehamn
|   |   |       |   |   |   |   Minsk
|   |   |       |   |   |   |   Monaco
|   |   |       |   |   |   |   Moscow
|   |   |       |   |   |   |   Nicosia
|   |   |       |   |   |   |   Oslo
|   |   |       |   |   |   |   Paris
|   |   |       |   |   |   |   Podgorica
|   |   |       |   |   |   |   Prague
|   |   |       |   |   |   |   Riga
|   |   |       |   |   |   |   Rome
|   |   |       |   |   |   |   Samara
|   |   |       |   |   |   |   San_Marino
|   |   |       |   |   |   |   Sarajevo
|   |   |       |   |   |   |   Saratov
|   |   |       |   |   |   |   Simferopol
|   |   |       |   |   |   |   Skopje
|   |   |       |   |   |   |   Sofia
|   |   |       |   |   |   |   Stockholm
|   |   |       |   |   |   |   Tallinn
|   |   |       |   |   |   |   Tirane
|   |   |       |   |   |   |   Tiraspol
|   |   |       |   |   |   |   Ulyanovsk
|   |   |       |   |   |   |   Uzhgorod
|   |   |       |   |   |   |   Vaduz
|   |   |       |   |   |   |   Vatican
|   |   |       |   |   |   |   Vienna
|   |   |       |   |   |   |   Vilnius
|   |   |       |   |   |   |   Volgograd
|   |   |       |   |   |   |   Warsaw
|   |   |       |   |   |   |   Zagreb
|   |   |       |   |   |   |   Zaporozhye
|   |   |       |   |   |   |   Zurich
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Indian
|   |   |       |   |   |   |   Antananarivo
|   |   |       |   |   |   |   Chagos
|   |   |       |   |   |   |   Christmas
|   |   |       |   |   |   |   Cocos
|   |   |       |   |   |   |   Comoro
|   |   |       |   |   |   |   Kerguelen
|   |   |       |   |   |   |   Mahe
|   |   |       |   |   |   |   Maldives
|   |   |       |   |   |   |   Mauritius
|   |   |       |   |   |   |   Mayotte
|   |   |       |   |   |   |   Reunion
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Mexico
|   |   |       |   |   |   |   BajaNorte
|   |   |       |   |   |   |   BajaSur
|   |   |       |   |   |   |   General
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---Pacific
|   |   |       |   |   |   |   Apia
|   |   |       |   |   |   |   Auckland
|   |   |       |   |   |   |   Bougainville
|   |   |       |   |   |   |   Chatham
|   |   |       |   |   |   |   Chuuk
|   |   |       |   |   |   |   Easter
|   |   |       |   |   |   |   Efate
|   |   |       |   |   |   |   Enderbury
|   |   |       |   |   |   |   Fakaofo
|   |   |       |   |   |   |   Fiji
|   |   |       |   |   |   |   Funafuti
|   |   |       |   |   |   |   Galapagos
|   |   |       |   |   |   |   Gambier
|   |   |       |   |   |   |   Guadalcanal
|   |   |       |   |   |   |   Guam
|   |   |       |   |   |   |   Honolulu
|   |   |       |   |   |   |   Johnston
|   |   |       |   |   |   |   Kanton
|   |   |       |   |   |   |   Kiritimati
|   |   |       |   |   |   |   Kosrae
|   |   |       |   |   |   |   Kwajalein
|   |   |       |   |   |   |   Majuro
|   |   |       |   |   |   |   Marquesas
|   |   |       |   |   |   |   Midway
|   |   |       |   |   |   |   Nauru
|   |   |       |   |   |   |   Niue
|   |   |       |   |   |   |   Norfolk
|   |   |       |   |   |   |   Noumea
|   |   |       |   |   |   |   Pago_Pago
|   |   |       |   |   |   |   Palau
|   |   |       |   |   |   |   Pitcairn
|   |   |       |   |   |   |   Pohnpei
|   |   |       |   |   |   |   Ponape
|   |   |       |   |   |   |   Port_Moresby
|   |   |       |   |   |   |   Rarotonga
|   |   |       |   |   |   |   Saipan
|   |   |       |   |   |   |   Samoa
|   |   |       |   |   |   |   Tahiti
|   |   |       |   |   |   |   Tarawa
|   |   |       |   |   |   |   Tongatapu
|   |   |       |   |   |   |   Truk
|   |   |       |   |   |   |   Wake
|   |   |       |   |   |   |   Wallis
|   |   |       |   |   |   |   Yap
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   +---US
|   |   |       |   |   |   |   Alaska
|   |   |       |   |   |   |   Aleutian
|   |   |       |   |   |   |   Arizona
|   |   |       |   |   |   |   Central
|   |   |       |   |   |   |   East-Indiana
|   |   |       |   |   |   |   Eastern
|   |   |       |   |   |   |   Hawaii
|   |   |       |   |   |   |   Indiana-Starke
|   |   |       |   |   |   |   Michigan
|   |   |       |   |   |   |   Mountain
|   |   |       |   |   |   |   Pacific
|   |   |       |   |   |   |   Samoa
|   |   |       |   |   |   |   __init__.py
|   |   |       |   |   |   |   
|   |   |       |   |   |   \---__pycache__
|   |   |       |   |   |           __init__.cpython-312.pyc
|   |   |       |   |   |           
|   |   |       |   |   \---__pycache__
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   \---__pycache__
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---tzdata-2025.2.dist-info
|   |   |       |   |   INSTALLER
|   |   |       |   |   METADATA
|   |   |       |   |   RECORD
|   |   |       |   |   top_level.txt
|   |   |       |   |   WHEEL
|   |   |       |   |   
|   |   |       |   \---licenses
|   |   |       |       |   LICENSE
|   |   |       |       |   
|   |   |       |       \---licenses
|   |   |       |               LICENSE_APACHE
|   |   |       |               
|   |   |       +---werkzeug
|   |   |       |   |   exceptions.py
|   |   |       |   |   formparser.py
|   |   |       |   |   http.py
|   |   |       |   |   local.py
|   |   |       |   |   py.typed
|   |   |       |   |   security.py
|   |   |       |   |   serving.py
|   |   |       |   |   test.py
|   |   |       |   |   testapp.py
|   |   |       |   |   urls.py
|   |   |       |   |   user_agent.py
|   |   |       |   |   utils.py
|   |   |       |   |   wsgi.py
|   |   |       |   |   _internal.py
|   |   |       |   |   _reloader.py
|   |   |       |   |   __init__.py
|   |   |       |   |   
|   |   |       |   +---datastructures
|   |   |       |   |   |   accept.py
|   |   |       |   |   |   auth.py
|   |   |       |   |   |   cache_control.py
|   |   |       |   |   |   csp.py
|   |   |       |   |   |   etag.py
|   |   |       |   |   |   file_storage.py
|   |   |       |   |   |   headers.py
|   |   |       |   |   |   mixins.py
|   |   |       |   |   |   range.py
|   |   |       |   |   |   structures.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           accept.cpython-312.pyc
|   |   |       |   |           auth.cpython-312.pyc
|   |   |       |   |           cache_control.cpython-312.pyc
|   |   |       |   |           csp.cpython-312.pyc
|   |   |       |   |           etag.cpython-312.pyc
|   |   |       |   |           file_storage.cpython-312.pyc
|   |   |       |   |           headers.cpython-312.pyc
|   |   |       |   |           mixins.cpython-312.pyc
|   |   |       |   |           range.cpython-312.pyc
|   |   |       |   |           structures.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---debug
|   |   |       |   |   |   console.py
|   |   |       |   |   |   repr.py
|   |   |       |   |   |   tbtools.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   +---shared
|   |   |       |   |   |       console.png
|   |   |       |   |   |       debugger.js
|   |   |       |   |   |       ICON_LICENSE.md
|   |   |       |   |   |       less.png
|   |   |       |   |   |       more.png
|   |   |       |   |   |       style.css
|   |   |       |   |   |       
|   |   |       |   |   \---__pycache__
|   |   |       |   |           console.cpython-312.pyc
|   |   |       |   |           repr.cpython-312.pyc
|   |   |       |   |           tbtools.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---middleware
|   |   |       |   |   |   dispatcher.py
|   |   |       |   |   |   http_proxy.py
|   |   |       |   |   |   lint.py
|   |   |       |   |   |   profiler.py
|   |   |       |   |   |   proxy_fix.py
|   |   |       |   |   |   shared_data.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           dispatcher.cpython-312.pyc
|   |   |       |   |           http_proxy.cpython-312.pyc
|   |   |       |   |           lint.cpython-312.pyc
|   |   |       |   |           profiler.cpython-312.pyc
|   |   |       |   |           proxy_fix.cpython-312.pyc
|   |   |       |   |           shared_data.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---routing
|   |   |       |   |   |   converters.py
|   |   |       |   |   |   exceptions.py
|   |   |       |   |   |   map.py
|   |   |       |   |   |   matcher.py
|   |   |       |   |   |   rules.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           converters.cpython-312.pyc
|   |   |       |   |           exceptions.cpython-312.pyc
|   |   |       |   |           map.cpython-312.pyc
|   |   |       |   |           matcher.cpython-312.pyc
|   |   |       |   |           rules.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---sansio
|   |   |       |   |   |   http.py
|   |   |       |   |   |   multipart.py
|   |   |       |   |   |   request.py
|   |   |       |   |   |   response.py
|   |   |       |   |   |   utils.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           http.cpython-312.pyc
|   |   |       |   |           multipart.cpython-312.pyc
|   |   |       |   |           request.cpython-312.pyc
|   |   |       |   |           response.cpython-312.pyc
|   |   |       |   |           utils.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   +---wrappers
|   |   |       |   |   |   request.py
|   |   |       |   |   |   response.py
|   |   |       |   |   |   __init__.py
|   |   |       |   |   |   
|   |   |       |   |   \---__pycache__
|   |   |       |   |           request.cpython-312.pyc
|   |   |       |   |           response.cpython-312.pyc
|   |   |       |   |           __init__.cpython-312.pyc
|   |   |       |   |           
|   |   |       |   \---__pycache__
|   |   |       |           exceptions.cpython-312.pyc
|   |   |       |           formparser.cpython-312.pyc
|   |   |       |           http.cpython-312.pyc
|   |   |       |           local.cpython-312.pyc
|   |   |       |           security.cpython-312.pyc
|   |   |       |           serving.cpython-312.pyc
|   |   |       |           test.cpython-312.pyc
|   |   |       |           testapp.cpython-312.pyc
|   |   |       |           urls.cpython-312.pyc
|   |   |       |           user_agent.cpython-312.pyc
|   |   |       |           utils.cpython-312.pyc
|   |   |       |           wsgi.cpython-312.pyc
|   |   |       |           _internal.cpython-312.pyc
|   |   |       |           _reloader.cpython-312.pyc
|   |   |       |           __init__.cpython-312.pyc
|   |   |       |           
|   |   |       +---werkzeug-3.1.3.dist-info
|   |   |       |       INSTALLER
|   |   |       |       LICENSE.txt
|   |   |       |       METADATA
|   |   |       |       RECORD
|   |   |       |       WHEEL
|   |   |       |       
|   |   |       \---__pycache__
|   |   |               typing_extensions.cpython-312.pyc
|   |   |               
|   |   \---Scripts
|   |           activate
|   |           activate.bat
|   |           Activate.ps1
|   |           deactivate.bat
|   |           dotenv.exe
|   |           flask.exe
|   |           gunicorn.exe
|   |           pip.exe
|   |           pip3.12.exe
|   |           pip3.exe
|   |           python.exe
|   |           pythonw.exe
|   |           
|   \---__pycache__
|           app.cpython-312.pyc
|           extensions.cpython-312.pyc
|           models.cpython-312.pyc
|           __init__.cpython-312.pyc
|           
\---frontend
    |   index.html
    |   package-lock.json
    |   package.json
    |   vite.config.js
    |   
    +---node_modules
    |   |   .package-lock.json
    |   |   
    |   +---.bin
    |   |       baseline-browser-mapping
    |   |       baseline-browser-mapping.cmd
    |   |       baseline-browser-mapping.ps1
    |   |       browserslist
    |   |       browserslist.cmd
    |   |       browserslist.ps1
    |   |       esbuild
    |   |       esbuild.cmd
    |   |       esbuild.ps1
    |   |       jsesc
    |   |       jsesc.cmd
    |   |       jsesc.ps1
    |   |       json5
    |   |       json5.cmd
    |   |       json5.ps1
    |   |       loose-envify
    |   |       loose-envify.cmd
    |   |       loose-envify.ps1
    |   |       nanoid
    |   |       nanoid.cmd
    |   |       nanoid.ps1
    |   |       parser
    |   |       parser.cmd
    |   |       parser.ps1
    |   |       rollup
    |   |       rollup.cmd
    |   |       rollup.ps1
    |   |       semver
    |   |       semver.cmd
    |   |       semver.ps1
    |   |       update-browserslist-db
    |   |       update-browserslist-db.cmd
    |   |       update-browserslist-db.ps1
    |   |       vite
    |   |       vite.cmd
    |   |       vite.ps1
    |   |       
    |   +---.vite
    |   |   \---deps
    |   |           axios.js
    |   |           axios.js.map
    |   |           chunk-DRWLMN53.js
    |   |           chunk-DRWLMN53.js.map
    |   |           chunk-G3PMV62Z.js
    |   |           chunk-G3PMV62Z.js.map
    |   |           chunk-PJEEZAML.js
    |   |           chunk-PJEEZAML.js.map
    |   |           package.json
    |   |           react-dom.js
    |   |           react-dom.js.map
    |   |           react-dom_client.js
    |   |           react-dom_client.js.map
    |   |           react-router-dom.js
    |   |           react-router-dom.js.map
    |   |           react.js
    |   |           react.js.map
    |   |           react_jsx-dev-runtime.js
    |   |           react_jsx-dev-runtime.js.map
    |   |           react_jsx-runtime.js
    |   |           react_jsx-runtime.js.map
    |   |           _metadata.json
    |   |           
    |   +---@babel
    |   |   +---code-frame
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           
    |   |   +---compat-data
    |   |   |   |   corejs2-built-ins.js
    |   |   |   |   corejs3-shipped-proposals.js
    |   |   |   |   LICENSE
    |   |   |   |   native-modules.js
    |   |   |   |   overlapping-plugins.js
    |   |   |   |   package.json
    |   |   |   |   plugin-bugfixes.js
    |   |   |   |   plugins.js
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---data
    |   |   |           corejs2-built-ins.json
    |   |   |           corejs3-shipped-proposals.json
    |   |   |           native-modules.json
    |   |   |           overlapping-plugins.json
    |   |   |           plugin-bugfixes.json
    |   |   |           plugins.json
    |   |   |           
    |   |   +---core
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   +---lib
    |   |   |   |   |   index.js
    |   |   |   |   |   index.js.map
    |   |   |   |   |   parse.js
    |   |   |   |   |   parse.js.map
    |   |   |   |   |   transform-ast.js
    |   |   |   |   |   transform-ast.js.map
    |   |   |   |   |   transform-file-browser.js
    |   |   |   |   |   transform-file-browser.js.map
    |   |   |   |   |   transform-file.js
    |   |   |   |   |   transform-file.js.map
    |   |   |   |   |   transform.js
    |   |   |   |   |   transform.js.map
    |   |   |   |   |   
    |   |   |   |   +---config
    |   |   |   |   |   |   cache-contexts.js
    |   |   |   |   |   |   cache-contexts.js.map
    |   |   |   |   |   |   caching.js
    |   |   |   |   |   |   caching.js.map
    |   |   |   |   |   |   config-chain.js
    |   |   |   |   |   |   config-chain.js.map
    |   |   |   |   |   |   config-descriptors.js
    |   |   |   |   |   |   config-descriptors.js.map
    |   |   |   |   |   |   full.js
    |   |   |   |   |   |   full.js.map
    |   |   |   |   |   |   index.js
    |   |   |   |   |   |   index.js.map
    |   |   |   |   |   |   item.js
    |   |   |   |   |   |   item.js.map
    |   |   |   |   |   |   partial.js
    |   |   |   |   |   |   partial.js.map
    |   |   |   |   |   |   pattern-to-regex.js
    |   |   |   |   |   |   pattern-to-regex.js.map
    |   |   |   |   |   |   plugin.js
    |   |   |   |   |   |   plugin.js.map
    |   |   |   |   |   |   printer.js
    |   |   |   |   |   |   printer.js.map
    |   |   |   |   |   |   resolve-targets-browser.js
    |   |   |   |   |   |   resolve-targets-browser.js.map
    |   |   |   |   |   |   resolve-targets.js
    |   |   |   |   |   |   resolve-targets.js.map
    |   |   |   |   |   |   util.js
    |   |   |   |   |   |   util.js.map
    |   |   |   |   |   |   
    |   |   |   |   |   +---files
    |   |   |   |   |   |       configuration.js
    |   |   |   |   |   |       configuration.js.map
    |   |   |   |   |   |       import.cjs
    |   |   |   |   |   |       import.cjs.map
    |   |   |   |   |   |       index-browser.js
    |   |   |   |   |   |       index-browser.js.map
    |   |   |   |   |   |       index.js
    |   |   |   |   |   |       index.js.map
    |   |   |   |   |   |       module-types.js
    |   |   |   |   |   |       module-types.js.map
    |   |   |   |   |   |       package.js
    |   |   |   |   |   |       package.js.map
    |   |   |   |   |   |       plugins.js
    |   |   |   |   |   |       plugins.js.map
    |   |   |   |   |   |       types.js
    |   |   |   |   |   |       types.js.map
    |   |   |   |   |   |       utils.js
    |   |   |   |   |   |       utils.js.map
    |   |   |   |   |   |       
    |   |   |   |   |   +---helpers
    |   |   |   |   |   |       config-api.js
    |   |   |   |   |   |       config-api.js.map
    |   |   |   |   |   |       deep-array.js
    |   |   |   |   |   |       deep-array.js.map
    |   |   |   |   |   |       environment.js
    |   |   |   |   |   |       environment.js.map
    |   |   |   |   |   |       
    |   |   |   |   |   \---validation
    |   |   |   |   |           option-assertions.js
    |   |   |   |   |           option-assertions.js.map
    |   |   |   |   |           options.js
    |   |   |   |   |           options.js.map
    |   |   |   |   |           plugins.js
    |   |   |   |   |           plugins.js.map
    |   |   |   |   |           removed.js
    |   |   |   |   |           removed.js.map
    |   |   |   |   |           
    |   |   |   |   +---errors
    |   |   |   |   |       config-error.js
    |   |   |   |   |       config-error.js.map
    |   |   |   |   |       rewrite-stack-trace.js
    |   |   |   |   |       rewrite-stack-trace.js.map
    |   |   |   |   |       
    |   |   |   |   +---gensync-utils
    |   |   |   |   |       async.js
    |   |   |   |   |       async.js.map
    |   |   |   |   |       fs.js
    |   |   |   |   |       fs.js.map
    |   |   |   |   |       functional.js
    |   |   |   |   |       functional.js.map
    |   |   |   |   |       
    |   |   |   |   +---parser
    |   |   |   |   |   |   index.js
    |   |   |   |   |   |   index.js.map
    |   |   |   |   |   |   
    |   |   |   |   |   \---util
    |   |   |   |   |           missing-plugin-helper.js
    |   |   |   |   |           missing-plugin-helper.js.map
    |   |   |   |   |           
    |   |   |   |   +---tools
    |   |   |   |   |       build-external-helpers.js
    |   |   |   |   |       build-external-helpers.js.map
    |   |   |   |   |       
    |   |   |   |   +---transformation
    |   |   |   |   |   |   block-hoist-plugin.js
    |   |   |   |   |   |   block-hoist-plugin.js.map
    |   |   |   |   |   |   index.js
    |   |   |   |   |   |   index.js.map
    |   |   |   |   |   |   normalize-file.js
    |   |   |   |   |   |   normalize-file.js.map
    |   |   |   |   |   |   normalize-opts.js
    |   |   |   |   |   |   normalize-opts.js.map
    |   |   |   |   |   |   plugin-pass.js
    |   |   |   |   |   |   plugin-pass.js.map
    |   |   |   |   |   |   
    |   |   |   |   |   +---file
    |   |   |   |   |   |       babel-7-helpers.cjs
    |   |   |   |   |   |       babel-7-helpers.cjs.map
    |   |   |   |   |   |       file.js
    |   |   |   |   |   |       file.js.map
    |   |   |   |   |   |       generate.js
    |   |   |   |   |   |       generate.js.map
    |   |   |   |   |   |       merge-map.js
    |   |   |   |   |   |       merge-map.js.map
    |   |   |   |   |   |       
    |   |   |   |   |   \---util
    |   |   |   |   |           clone-deep.js
    |   |   |   |   |           clone-deep.js.map
    |   |   |   |   |           
    |   |   |   |   \---vendor
    |   |   |   |           import-meta-resolve.js
    |   |   |   |           import-meta-resolve.js.map
    |   |   |   |           
    |   |   |   \---src
    |   |   |       |   transform-file-browser.ts
    |   |   |       |   transform-file.ts
    |   |   |       |   
    |   |   |       \---config
    |   |   |           |   resolve-targets-browser.ts
    |   |   |           |   resolve-targets.ts
    |   |   |           |   
    |   |   |           \---files
    |   |   |                   index-browser.ts
    |   |   |                   index.ts
    |   |   |                   
    |   |   +---generator
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |       |   buffer.js
    |   |   |       |   buffer.js.map
    |   |   |       |   index.js
    |   |   |       |   index.js.map
    |   |   |       |   printer.js
    |   |   |       |   printer.js.map
    |   |   |       |   source-map.js
    |   |   |       |   source-map.js.map
    |   |   |       |   token-map.js
    |   |   |       |   token-map.js.map
    |   |   |       |   
    |   |   |       +---generators
    |   |   |       |       base.js
    |   |   |       |       base.js.map
    |   |   |       |       classes.js
    |   |   |       |       classes.js.map
    |   |   |       |       deprecated.js
    |   |   |       |       deprecated.js.map
    |   |   |       |       expressions.js
    |   |   |       |       expressions.js.map
    |   |   |       |       flow.js
    |   |   |       |       flow.js.map
    |   |   |       |       index.js
    |   |   |       |       index.js.map
    |   |   |       |       jsx.js
    |   |   |       |       jsx.js.map
    |   |   |       |       methods.js
    |   |   |       |       methods.js.map
    |   |   |       |       modules.js
    |   |   |       |       modules.js.map
    |   |   |       |       statements.js
    |   |   |       |       statements.js.map
    |   |   |       |       template-literals.js
    |   |   |       |       template-literals.js.map
    |   |   |       |       types.js
    |   |   |       |       types.js.map
    |   |   |       |       typescript.js
    |   |   |       |       typescript.js.map
    |   |   |       |       
    |   |   |       \---node
    |   |   |               index.js
    |   |   |               index.js.map
    |   |   |               parentheses.js
    |   |   |               parentheses.js.map
    |   |   |               whitespace.js
    |   |   |               whitespace.js.map
    |   |   |               
    |   |   +---helper-compilation-targets
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           debug.js
    |   |   |           debug.js.map
    |   |   |           filter-items.js
    |   |   |           filter-items.js.map
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           options.js
    |   |   |           options.js.map
    |   |   |           pretty.js
    |   |   |           pretty.js.map
    |   |   |           targets.js
    |   |   |           targets.js.map
    |   |   |           utils.js
    |   |   |           utils.js.map
    |   |   |           
    |   |   +---helper-globals
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---data
    |   |   |           browser-upper.json
    |   |   |           builtin-lower.json
    |   |   |           builtin-upper.json
    |   |   |           
    |   |   +---helper-module-imports
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           import-builder.js
    |   |   |           import-builder.js.map
    |   |   |           import-injector.js
    |   |   |           import-injector.js.map
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           is-module.js
    |   |   |           is-module.js.map
    |   |   |           
    |   |   +---helper-module-transforms
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           dynamic-import.js
    |   |   |           dynamic-import.js.map
    |   |   |           get-module-name.js
    |   |   |           get-module-name.js.map
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           lazy-modules.js
    |   |   |           lazy-modules.js.map
    |   |   |           normalize-and-load-metadata.js
    |   |   |           normalize-and-load-metadata.js.map
    |   |   |           rewrite-live-references.js
    |   |   |           rewrite-live-references.js.map
    |   |   |           rewrite-this.js
    |   |   |           rewrite-this.js.map
    |   |   |           
    |   |   +---helper-plugin-utils
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           
    |   |   +---helper-string-parser
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           
    |   |   +---helper-validator-identifier
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           identifier.js
    |   |   |           identifier.js.map
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           keyword.js
    |   |   |           keyword.js.map
    |   |   |           
    |   |   +---helper-validator-option
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           find-suggestion.js
    |   |   |           find-suggestion.js.map
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           validator.js
    |   |   |           validator.js.map
    |   |   |           
    |   |   +---helpers
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |       |   helpers-generated.js
    |   |   |       |   helpers-generated.js.map
    |   |   |       |   index.js
    |   |   |       |   index.js.map
    |   |   |       |   
    |   |   |       \---helpers
    |   |   |               applyDecoratedDescriptor.js
    |   |   |               applyDecoratedDescriptor.js.map
    |   |   |               applyDecs.js
    |   |   |               applyDecs.js.map
    |   |   |               applyDecs2203.js
    |   |   |               applyDecs2203.js.map
    |   |   |               applyDecs2203R.js
    |   |   |               applyDecs2203R.js.map
    |   |   |               applyDecs2301.js
    |   |   |               applyDecs2301.js.map
    |   |   |               applyDecs2305.js
    |   |   |               applyDecs2305.js.map
    |   |   |               applyDecs2311.js
    |   |   |               applyDecs2311.js.map
    |   |   |               arrayLikeToArray.js
    |   |   |               arrayLikeToArray.js.map
    |   |   |               arrayWithHoles.js
    |   |   |               arrayWithHoles.js.map
    |   |   |               arrayWithoutHoles.js
    |   |   |               arrayWithoutHoles.js.map
    |   |   |               assertClassBrand.js
    |   |   |               assertClassBrand.js.map
    |   |   |               assertThisInitialized.js
    |   |   |               assertThisInitialized.js.map
    |   |   |               asyncGeneratorDelegate.js
    |   |   |               asyncGeneratorDelegate.js.map
    |   |   |               asyncIterator.js
    |   |   |               asyncIterator.js.map
    |   |   |               asyncToGenerator.js
    |   |   |               asyncToGenerator.js.map
    |   |   |               awaitAsyncGenerator.js
    |   |   |               awaitAsyncGenerator.js.map
    |   |   |               AwaitValue.js
    |   |   |               AwaitValue.js.map
    |   |   |               callSuper.js
    |   |   |               callSuper.js.map
    |   |   |               checkInRHS.js
    |   |   |               checkInRHS.js.map
    |   |   |               checkPrivateRedeclaration.js
    |   |   |               checkPrivateRedeclaration.js.map
    |   |   |               classApplyDescriptorDestructureSet.js
    |   |   |               classApplyDescriptorDestructureSet.js.map
    |   |   |               classApplyDescriptorGet.js
    |   |   |               classApplyDescriptorGet.js.map
    |   |   |               classApplyDescriptorSet.js
    |   |   |               classApplyDescriptorSet.js.map
    |   |   |               classCallCheck.js
    |   |   |               classCallCheck.js.map
    |   |   |               classCheckPrivateStaticAccess.js
    |   |   |               classCheckPrivateStaticAccess.js.map
    |   |   |               classCheckPrivateStaticFieldDescriptor.js
    |   |   |               classCheckPrivateStaticFieldDescriptor.js.map
    |   |   |               classExtractFieldDescriptor.js
    |   |   |               classExtractFieldDescriptor.js.map
    |   |   |               classNameTDZError.js
    |   |   |               classNameTDZError.js.map
    |   |   |               classPrivateFieldDestructureSet.js
    |   |   |               classPrivateFieldDestructureSet.js.map
    |   |   |               classPrivateFieldGet.js
    |   |   |               classPrivateFieldGet.js.map
    |   |   |               classPrivateFieldGet2.js
    |   |   |               classPrivateFieldGet2.js.map
    |   |   |               classPrivateFieldInitSpec.js
    |   |   |               classPrivateFieldInitSpec.js.map
    |   |   |               classPrivateFieldLooseBase.js
    |   |   |               classPrivateFieldLooseBase.js.map
    |   |   |               classPrivateFieldLooseKey.js
    |   |   |               classPrivateFieldLooseKey.js.map
    |   |   |               classPrivateFieldSet.js
    |   |   |               classPrivateFieldSet.js.map
    |   |   |               classPrivateFieldSet2.js
    |   |   |               classPrivateFieldSet2.js.map
    |   |   |               classPrivateGetter.js
    |   |   |               classPrivateGetter.js.map
    |   |   |               classPrivateMethodGet.js
    |   |   |               classPrivateMethodGet.js.map
    |   |   |               classPrivateMethodInitSpec.js
    |   |   |               classPrivateMethodInitSpec.js.map
    |   |   |               classPrivateMethodSet.js
    |   |   |               classPrivateMethodSet.js.map
    |   |   |               classPrivateSetter.js
    |   |   |               classPrivateSetter.js.map
    |   |   |               classStaticPrivateFieldDestructureSet.js
    |   |   |               classStaticPrivateFieldDestructureSet.js.map
    |   |   |               classStaticPrivateFieldSpecGet.js
    |   |   |               classStaticPrivateFieldSpecGet.js.map
    |   |   |               classStaticPrivateFieldSpecSet.js
    |   |   |               classStaticPrivateFieldSpecSet.js.map
    |   |   |               classStaticPrivateMethodGet.js
    |   |   |               classStaticPrivateMethodGet.js.map
    |   |   |               classStaticPrivateMethodSet.js
    |   |   |               classStaticPrivateMethodSet.js.map
    |   |   |               construct.js
    |   |   |               construct.js.map
    |   |   |               createClass.js
    |   |   |               createClass.js.map
    |   |   |               createForOfIteratorHelper.js
    |   |   |               createForOfIteratorHelper.js.map
    |   |   |               createForOfIteratorHelperLoose.js
    |   |   |               createForOfIteratorHelperLoose.js.map
    |   |   |               createSuper.js
    |   |   |               createSuper.js.map
    |   |   |               decorate.js
    |   |   |               decorate.js.map
    |   |   |               defaults.js
    |   |   |               defaults.js.map
    |   |   |               defineAccessor.js
    |   |   |               defineAccessor.js.map
    |   |   |               defineEnumerableProperties.js
    |   |   |               defineEnumerableProperties.js.map
    |   |   |               defineProperty.js
    |   |   |               defineProperty.js.map
    |   |   |               dispose.js
    |   |   |               dispose.js.map
    |   |   |               extends.js
    |   |   |               extends.js.map
    |   |   |               get.js
    |   |   |               get.js.map
    |   |   |               getPrototypeOf.js
    |   |   |               getPrototypeOf.js.map
    |   |   |               identity.js
    |   |   |               identity.js.map
    |   |   |               importDeferProxy.js
    |   |   |               importDeferProxy.js.map
    |   |   |               inherits.js
    |   |   |               inherits.js.map
    |   |   |               inheritsLoose.js
    |   |   |               inheritsLoose.js.map
    |   |   |               initializerDefineProperty.js
    |   |   |               initializerDefineProperty.js.map
    |   |   |               initializerWarningHelper.js
    |   |   |               initializerWarningHelper.js.map
    |   |   |               instanceof.js
    |   |   |               instanceof.js.map
    |   |   |               interopRequireDefault.js
    |   |   |               interopRequireDefault.js.map
    |   |   |               interopRequireWildcard.js
    |   |   |               interopRequireWildcard.js.map
    |   |   |               isNativeFunction.js
    |   |   |               isNativeFunction.js.map
    |   |   |               isNativeReflectConstruct.js
    |   |   |               isNativeReflectConstruct.js.map
    |   |   |               iterableToArray.js
    |   |   |               iterableToArray.js.map
    |   |   |               iterableToArrayLimit.js
    |   |   |               iterableToArrayLimit.js.map
    |   |   |               jsx.js
    |   |   |               jsx.js.map
    |   |   |               maybeArrayLike.js
    |   |   |               maybeArrayLike.js.map
    |   |   |               newArrowCheck.js
    |   |   |               newArrowCheck.js.map
    |   |   |               nonIterableRest.js
    |   |   |               nonIterableRest.js.map
    |   |   |               nonIterableSpread.js
    |   |   |               nonIterableSpread.js.map
    |   |   |               nullishReceiverError.js
    |   |   |               nullishReceiverError.js.map
    |   |   |               objectDestructuringEmpty.js
    |   |   |               objectDestructuringEmpty.js.map
    |   |   |               objectSpread.js
    |   |   |               objectSpread.js.map
    |   |   |               objectSpread2.js
    |   |   |               objectSpread2.js.map
    |   |   |               objectWithoutProperties.js
    |   |   |               objectWithoutProperties.js.map
    |   |   |               objectWithoutPropertiesLoose.js
    |   |   |               objectWithoutPropertiesLoose.js.map
    |   |   |               OverloadYield.js
    |   |   |               OverloadYield.js.map
    |   |   |               possibleConstructorReturn.js
    |   |   |               possibleConstructorReturn.js.map
    |   |   |               readOnlyError.js
    |   |   |               readOnlyError.js.map
    |   |   |               regenerator.js
    |   |   |               regenerator.js.map
    |   |   |               regeneratorAsync.js
    |   |   |               regeneratorAsync.js.map
    |   |   |               regeneratorAsyncGen.js
    |   |   |               regeneratorAsyncGen.js.map
    |   |   |               regeneratorAsyncIterator.js
    |   |   |               regeneratorAsyncIterator.js.map
    |   |   |               regeneratorDefine.js
    |   |   |               regeneratorDefine.js.map
    |   |   |               regeneratorKeys.js
    |   |   |               regeneratorKeys.js.map
    |   |   |               regeneratorRuntime.js
    |   |   |               regeneratorRuntime.js.map
    |   |   |               regeneratorValues.js
    |   |   |               regeneratorValues.js.map
    |   |   |               set.js
    |   |   |               set.js.map
    |   |   |               setFunctionName.js
    |   |   |               setFunctionName.js.map
    |   |   |               setPrototypeOf.js
    |   |   |               setPrototypeOf.js.map
    |   |   |               skipFirstGeneratorNext.js
    |   |   |               skipFirstGeneratorNext.js.map
    |   |   |               slicedToArray.js
    |   |   |               slicedToArray.js.map
    |   |   |               superPropBase.js
    |   |   |               superPropBase.js.map
    |   |   |               superPropGet.js
    |   |   |               superPropGet.js.map
    |   |   |               superPropSet.js
    |   |   |               superPropSet.js.map
    |   |   |               taggedTemplateLiteral.js
    |   |   |               taggedTemplateLiteral.js.map
    |   |   |               taggedTemplateLiteralLoose.js
    |   |   |               taggedTemplateLiteralLoose.js.map
    |   |   |               tdz.js
    |   |   |               tdz.js.map
    |   |   |               temporalRef.js
    |   |   |               temporalRef.js.map
    |   |   |               temporalUndefined.js
    |   |   |               temporalUndefined.js.map
    |   |   |               toArray.js
    |   |   |               toArray.js.map
    |   |   |               toConsumableArray.js
    |   |   |               toConsumableArray.js.map
    |   |   |               toPrimitive.js
    |   |   |               toPrimitive.js.map
    |   |   |               toPropertyKey.js
    |   |   |               toPropertyKey.js.map
    |   |   |               toSetter.js
    |   |   |               toSetter.js.map
    |   |   |               tsRewriteRelativeImportExtensions.js
    |   |   |               tsRewriteRelativeImportExtensions.js.map
    |   |   |               typeof.js
    |   |   |               typeof.js.map
    |   |   |               unsupportedIterableToArray.js
    |   |   |               unsupportedIterableToArray.js.map
    |   |   |               using.js
    |   |   |               using.js.map
    |   |   |               usingCtx.js
    |   |   |               usingCtx.js.map
    |   |   |               wrapAsyncGenerator.js
    |   |   |               wrapAsyncGenerator.js.map
    |   |   |               wrapNativeSuper.js
    |   |   |               wrapNativeSuper.js.map
    |   |   |               wrapRegExp.js
    |   |   |               wrapRegExp.js.map
    |   |   |               writeOnlyError.js
    |   |   |               writeOnlyError.js.map
    |   |   |               
    |   |   +---parser
    |   |   |   |   CHANGELOG.md
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   +---bin
    |   |   |   |       babel-parser.js
    |   |   |   |       
    |   |   |   +---lib
    |   |   |   |       index.js
    |   |   |   |       index.js.map
    |   |   |   |       
    |   |   |   \---typings
    |   |   |           babel-parser.d.ts
    |   |   |           
    |   |   +---plugin-transform-react-jsx-self
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           
    |   |   +---plugin-transform-react-jsx-source
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           
    |   |   +---template
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           builder.js
    |   |   |           builder.js.map
    |   |   |           formatters.js
    |   |   |           formatters.js.map
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           literal.js
    |   |   |           literal.js.map
    |   |   |           options.js
    |   |   |           options.js.map
    |   |   |           parse.js
    |   |   |           parse.js.map
    |   |   |           populate.js
    |   |   |           populate.js.map
    |   |   |           string.js
    |   |   |           string.js.map
    |   |   |           
    |   |   +---traverse
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |       |   cache.js
    |   |   |       |   cache.js.map
    |   |   |       |   context.js
    |   |   |       |   context.js.map
    |   |   |       |   hub.js
    |   |   |       |   hub.js.map
    |   |   |       |   index.js
    |   |   |       |   index.js.map
    |   |   |       |   traverse-node.js
    |   |   |       |   traverse-node.js.map
    |   |   |       |   types.js
    |   |   |       |   types.js.map
    |   |   |       |   visitors.js
    |   |   |       |   visitors.js.map
    |   |   |       |   
    |   |   |       +---path
    |   |   |       |   |   ancestry.js
    |   |   |       |   |   ancestry.js.map
    |   |   |       |   |   comments.js
    |   |   |       |   |   comments.js.map
    |   |   |       |   |   context.js
    |   |   |       |   |   context.js.map
    |   |   |       |   |   conversion.js
    |   |   |       |   |   conversion.js.map
    |   |   |       |   |   evaluation.js
    |   |   |       |   |   evaluation.js.map
    |   |   |       |   |   family.js
    |   |   |       |   |   family.js.map
    |   |   |       |   |   index.js
    |   |   |       |   |   index.js.map
    |   |   |       |   |   introspection.js
    |   |   |       |   |   introspection.js.map
    |   |   |       |   |   modification.js
    |   |   |       |   |   modification.js.map
    |   |   |       |   |   removal.js
    |   |   |       |   |   removal.js.map
    |   |   |       |   |   replacement.js
    |   |   |       |   |   replacement.js.map
    |   |   |       |   |   
    |   |   |       |   +---inference
    |   |   |       |   |       index.js
    |   |   |       |   |       index.js.map
    |   |   |       |   |       inferer-reference.js
    |   |   |       |   |       inferer-reference.js.map
    |   |   |       |   |       inferers.js
    |   |   |       |   |       inferers.js.map
    |   |   |       |   |       util.js
    |   |   |       |   |       util.js.map
    |   |   |       |   |       
    |   |   |       |   \---lib
    |   |   |       |           hoister.js
    |   |   |       |           hoister.js.map
    |   |   |       |           removal-hooks.js
    |   |   |       |           removal-hooks.js.map
    |   |   |       |           virtual-types-validator.js
    |   |   |       |           virtual-types-validator.js.map
    |   |   |       |           virtual-types.js
    |   |   |       |           virtual-types.js.map
    |   |   |       |           
    |   |   |       \---scope
    |   |   |           |   binding.js
    |   |   |           |   binding.js.map
    |   |   |           |   index.js
    |   |   |           |   index.js.map
    |   |   |           |   
    |   |   |           \---lib
    |   |   |                   renamer.js
    |   |   |                   renamer.js.map
    |   |   |                   
    |   |   \---types
    |   |       |   LICENSE
    |   |       |   package.json
    |   |       |   README.md
    |   |       |   
    |   |       \---lib
    |   |           |   index-legacy.d.ts
    |   |           |   index.d.ts
    |   |           |   index.js
    |   |           |   index.js.flow
    |   |           |   index.js.map
    |   |           |   
    |   |           +---asserts
    |   |           |   |   assertNode.js
    |   |           |   |   assertNode.js.map
    |   |           |   |   
    |   |           |   \---generated
    |   |           |           index.js
    |   |           |           index.js.map
    |   |           |           
    |   |           +---ast-types
    |   |           |   \---generated
    |   |           |           index.js
    |   |           |           index.js.map
    |   |           |           
    |   |           +---builders
    |   |           |   |   productions.js
    |   |           |   |   productions.js.map
    |   |           |   |   validateNode.js
    |   |           |   |   validateNode.js.map
    |   |           |   |   
    |   |           |   +---flow
    |   |           |   |       createFlowUnionType.js
    |   |           |   |       createFlowUnionType.js.map
    |   |           |   |       createTypeAnnotationBasedOnTypeof.js
    |   |           |   |       createTypeAnnotationBasedOnTypeof.js.map
    |   |           |   |       
    |   |           |   +---generated
    |   |           |   |       index.js
    |   |           |   |       index.js.map
    |   |           |   |       lowercase.js
    |   |           |   |       lowercase.js.map
    |   |           |   |       uppercase.js
    |   |           |   |       uppercase.js.map
    |   |           |   |       
    |   |           |   +---react
    |   |           |   |       buildChildren.js
    |   |           |   |       buildChildren.js.map
    |   |           |   |       
    |   |           |   \---typescript
    |   |           |           createTSUnionType.js
    |   |           |           createTSUnionType.js.map
    |   |           |           
    |   |           +---clone
    |   |           |       clone.js
    |   |           |       clone.js.map
    |   |           |       cloneDeep.js
    |   |           |       cloneDeep.js.map
    |   |           |       cloneDeepWithoutLoc.js
    |   |           |       cloneDeepWithoutLoc.js.map
    |   |           |       cloneNode.js
    |   |           |       cloneNode.js.map
    |   |           |       cloneWithoutLoc.js
    |   |           |       cloneWithoutLoc.js.map
    |   |           |       
    |   |           +---comments
    |   |           |       addComment.js
    |   |           |       addComment.js.map
    |   |           |       addComments.js
    |   |           |       addComments.js.map
    |   |           |       inheritInnerComments.js
    |   |           |       inheritInnerComments.js.map
    |   |           |       inheritLeadingComments.js
    |   |           |       inheritLeadingComments.js.map
    |   |           |       inheritsComments.js
    |   |           |       inheritsComments.js.map
    |   |           |       inheritTrailingComments.js
    |   |           |       inheritTrailingComments.js.map
    |   |           |       removeComments.js
    |   |           |       removeComments.js.map
    |   |           |       
    |   |           +---constants
    |   |           |   |   index.js
    |   |           |   |   index.js.map
    |   |           |   |   
    |   |           |   \---generated
    |   |           |           index.js
    |   |           |           index.js.map
    |   |           |           
    |   |           +---converters
    |   |           |       ensureBlock.js
    |   |           |       ensureBlock.js.map
    |   |           |       gatherSequenceExpressions.js
    |   |           |       gatherSequenceExpressions.js.map
    |   |           |       toBindingIdentifierName.js
    |   |           |       toBindingIdentifierName.js.map
    |   |           |       toBlock.js
    |   |           |       toBlock.js.map
    |   |           |       toComputedKey.js
    |   |           |       toComputedKey.js.map
    |   |           |       toExpression.js
    |   |           |       toExpression.js.map
    |   |           |       toIdentifier.js
    |   |           |       toIdentifier.js.map
    |   |           |       toKeyAlias.js
    |   |           |       toKeyAlias.js.map
    |   |           |       toSequenceExpression.js
    |   |           |       toSequenceExpression.js.map
    |   |           |       toStatement.js
    |   |           |       toStatement.js.map
    |   |           |       valueToNode.js
    |   |           |       valueToNode.js.map
    |   |           |       
    |   |           +---definitions
    |   |           |       core.js
    |   |           |       core.js.map
    |   |           |       deprecated-aliases.js
    |   |           |       deprecated-aliases.js.map
    |   |           |       experimental.js
    |   |           |       experimental.js.map
    |   |           |       flow.js
    |   |           |       flow.js.map
    |   |           |       index.js
    |   |           |       index.js.map
    |   |           |       jsx.js
    |   |           |       jsx.js.map
    |   |           |       misc.js
    |   |           |       misc.js.map
    |   |           |       placeholders.js
    |   |           |       placeholders.js.map
    |   |           |       typescript.js
    |   |           |       typescript.js.map
    |   |           |       utils.js
    |   |           |       utils.js.map
    |   |           |       
    |   |           +---modifications
    |   |           |   |   appendToMemberExpression.js
    |   |           |   |   appendToMemberExpression.js.map
    |   |           |   |   inherits.js
    |   |           |   |   inherits.js.map
    |   |           |   |   prependToMemberExpression.js
    |   |           |   |   prependToMemberExpression.js.map
    |   |           |   |   removeProperties.js
    |   |           |   |   removeProperties.js.map
    |   |           |   |   removePropertiesDeep.js
    |   |           |   |   removePropertiesDeep.js.map
    |   |           |   |   
    |   |           |   +---flow
    |   |           |   |       removeTypeDuplicates.js
    |   |           |   |       removeTypeDuplicates.js.map
    |   |           |   |       
    |   |           |   \---typescript
    |   |           |           removeTypeDuplicates.js
    |   |           |           removeTypeDuplicates.js.map
    |   |           |           
    |   |           +---retrievers
    |   |           |       getAssignmentIdentifiers.js
    |   |           |       getAssignmentIdentifiers.js.map
    |   |           |       getBindingIdentifiers.js
    |   |           |       getBindingIdentifiers.js.map
    |   |           |       getFunctionName.js
    |   |           |       getFunctionName.js.map
    |   |           |       getOuterBindingIdentifiers.js
    |   |           |       getOuterBindingIdentifiers.js.map
    |   |           |       
    |   |           +---traverse
    |   |           |       traverse.js
    |   |           |       traverse.js.map
    |   |           |       traverseFast.js
    |   |           |       traverseFast.js.map
    |   |           |       
    |   |           +---utils
    |   |           |   |   deprecationWarning.js
    |   |           |   |   deprecationWarning.js.map
    |   |           |   |   inherit.js
    |   |           |   |   inherit.js.map
    |   |           |   |   shallowEqual.js
    |   |           |   |   shallowEqual.js.map
    |   |           |   |   
    |   |           |   \---react
    |   |           |           cleanJSXElementLiteralChild.js
    |   |           |           cleanJSXElementLiteralChild.js.map
    |   |           |           
    |   |           \---validators
    |   |               |   buildMatchMemberExpression.js
    |   |               |   buildMatchMemberExpression.js.map
    |   |               |   is.js
    |   |               |   is.js.map
    |   |               |   isBinding.js
    |   |               |   isBinding.js.map
    |   |               |   isBlockScoped.js
    |   |               |   isBlockScoped.js.map
    |   |               |   isImmutable.js
    |   |               |   isImmutable.js.map
    |   |               |   isLet.js
    |   |               |   isLet.js.map
    |   |               |   isNode.js
    |   |               |   isNode.js.map
    |   |               |   isNodesEquivalent.js
    |   |               |   isNodesEquivalent.js.map
    |   |               |   isPlaceholderType.js
    |   |               |   isPlaceholderType.js.map
    |   |               |   isReferenced.js
    |   |               |   isReferenced.js.map
    |   |               |   isScope.js
    |   |               |   isScope.js.map
    |   |               |   isSpecifierDefault.js
    |   |               |   isSpecifierDefault.js.map
    |   |               |   isType.js
    |   |               |   isType.js.map
    |   |               |   isValidES3Identifier.js
    |   |               |   isValidES3Identifier.js.map
    |   |               |   isValidIdentifier.js
    |   |               |   isValidIdentifier.js.map
    |   |               |   isVar.js
    |   |               |   isVar.js.map
    |   |               |   matchesPattern.js
    |   |               |   matchesPattern.js.map
    |   |               |   validate.js
    |   |               |   validate.js.map
    |   |               |   
    |   |               +---generated
    |   |               |       index.js
    |   |               |       index.js.map
    |   |               |       
    |   |               \---react
    |   |                       isCompatTag.js
    |   |                       isCompatTag.js.map
    |   |                       isReactComponent.js
    |   |                       isReactComponent.js.map
    |   |                       
    |   +---@esbuild
    |   |   \---win32-x64
    |   |           esbuild.exe
    |   |           package.json
    |   |           README.md
    |   |           
    |   +---@jridgewell
    |   |   +---gen-mapping
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   +---dist
    |   |   |   |   |   gen-mapping.mjs
    |   |   |   |   |   gen-mapping.mjs.map
    |   |   |   |   |   gen-mapping.umd.js
    |   |   |   |   |   gen-mapping.umd.js.map
    |   |   |   |   |   
    |   |   |   |   \---types
    |   |   |   |           gen-mapping.d.ts
    |   |   |   |           set-array.d.ts
    |   |   |   |           sourcemap-segment.d.ts
    |   |   |   |           types.d.ts
    |   |   |   |           
    |   |   |   +---src
    |   |   |   |       gen-mapping.ts
    |   |   |   |       set-array.ts
    |   |   |   |       sourcemap-segment.ts
    |   |   |   |       types.ts
    |   |   |   |       
    |   |   |   \---types
    |   |   |           gen-mapping.d.cts
    |   |   |           gen-mapping.d.cts.map
    |   |   |           gen-mapping.d.mts
    |   |   |           gen-mapping.d.mts.map
    |   |   |           set-array.d.cts
    |   |   |           set-array.d.cts.map
    |   |   |           set-array.d.mts
    |   |   |           set-array.d.mts.map
    |   |   |           sourcemap-segment.d.cts
    |   |   |           sourcemap-segment.d.cts.map
    |   |   |           sourcemap-segment.d.mts
    |   |   |           sourcemap-segment.d.mts.map
    |   |   |           types.d.cts
    |   |   |           types.d.cts.map
    |   |   |           types.d.mts
    |   |   |           types.d.mts.map
    |   |   |           
    |   |   +---remapping
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   +---dist
    |   |   |   |       remapping.mjs
    |   |   |   |       remapping.mjs.map
    |   |   |   |       remapping.umd.js
    |   |   |   |       remapping.umd.js.map
    |   |   |   |       
    |   |   |   +---src
    |   |   |   |       build-source-map-tree.ts
    |   |   |   |       remapping.ts
    |   |   |   |       source-map-tree.ts
    |   |   |   |       source-map.ts
    |   |   |   |       types.ts
    |   |   |   |       
    |   |   |   \---types
    |   |   |           build-source-map-tree.d.cts
    |   |   |           build-source-map-tree.d.cts.map
    |   |   |           build-source-map-tree.d.mts
    |   |   |           build-source-map-tree.d.mts.map
    |   |   |           remapping.d.cts
    |   |   |           remapping.d.cts.map
    |   |   |           remapping.d.mts
    |   |   |           remapping.d.mts.map
    |   |   |           source-map-tree.d.cts
    |   |   |           source-map-tree.d.cts.map
    |   |   |           source-map-tree.d.mts
    |   |   |           source-map-tree.d.mts.map
    |   |   |           source-map.d.cts
    |   |   |           source-map.d.cts.map
    |   |   |           source-map.d.mts
    |   |   |           source-map.d.mts.map
    |   |   |           types.d.cts
    |   |   |           types.d.cts.map
    |   |   |           types.d.mts
    |   |   |           types.d.mts.map
    |   |   |           
    |   |   +---resolve-uri
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---dist
    |   |   |       |   resolve-uri.mjs
    |   |   |       |   resolve-uri.mjs.map
    |   |   |       |   resolve-uri.umd.js
    |   |   |       |   resolve-uri.umd.js.map
    |   |   |       |   
    |   |   |       \---types
    |   |   |               resolve-uri.d.ts
    |   |   |               
    |   |   +---sourcemap-codec
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   +---dist
    |   |   |   |       sourcemap-codec.mjs
    |   |   |   |       sourcemap-codec.mjs.map
    |   |   |   |       sourcemap-codec.umd.js
    |   |   |   |       sourcemap-codec.umd.js.map
    |   |   |   |       
    |   |   |   +---src
    |   |   |   |       scopes.ts
    |   |   |   |       sourcemap-codec.ts
    |   |   |   |       strings.ts
    |   |   |   |       vlq.ts
    |   |   |   |       
    |   |   |   \---types
    |   |   |           scopes.d.cts
    |   |   |           scopes.d.cts.map
    |   |   |           scopes.d.mts
    |   |   |           scopes.d.mts.map
    |   |   |           sourcemap-codec.d.cts
    |   |   |           sourcemap-codec.d.cts.map
    |   |   |           sourcemap-codec.d.mts
    |   |   |           sourcemap-codec.d.mts.map
    |   |   |           strings.d.cts
    |   |   |           strings.d.cts.map
    |   |   |           strings.d.mts
    |   |   |           strings.d.mts.map
    |   |   |           vlq.d.cts
    |   |   |           vlq.d.cts.map
    |   |   |           vlq.d.mts
    |   |   |           vlq.d.mts.map
    |   |   |           
    |   |   \---trace-mapping
    |   |       |   LICENSE
    |   |       |   package.json
    |   |       |   README.md
    |   |       |   
    |   |       +---dist
    |   |       |       trace-mapping.mjs
    |   |       |       trace-mapping.mjs.map
    |   |       |       trace-mapping.umd.js
    |   |       |       trace-mapping.umd.js.map
    |   |       |       
    |   |       +---src
    |   |       |       binary-search.ts
    |   |       |       by-source.ts
    |   |       |       flatten-map.ts
    |   |       |       resolve.ts
    |   |       |       sort.ts
    |   |       |       sourcemap-segment.ts
    |   |       |       strip-filename.ts
    |   |       |       trace-mapping.ts
    |   |       |       types.ts
    |   |       |       
    |   |       \---types
    |   |               binary-search.d.cts
    |   |               binary-search.d.cts.map
    |   |               binary-search.d.mts
    |   |               binary-search.d.mts.map
    |   |               by-source.d.cts
    |   |               by-source.d.cts.map
    |   |               by-source.d.mts
    |   |               by-source.d.mts.map
    |   |               flatten-map.d.cts
    |   |               flatten-map.d.cts.map
    |   |               flatten-map.d.mts
    |   |               flatten-map.d.mts.map
    |   |               resolve.d.cts
    |   |               resolve.d.cts.map
    |   |               resolve.d.mts
    |   |               resolve.d.mts.map
    |   |               sort.d.cts
    |   |               sort.d.cts.map
    |   |               sort.d.mts
    |   |               sort.d.mts.map
    |   |               sourcemap-segment.d.cts
    |   |               sourcemap-segment.d.cts.map
    |   |               sourcemap-segment.d.mts
    |   |               sourcemap-segment.d.mts.map
    |   |               strip-filename.d.cts
    |   |               strip-filename.d.cts.map
    |   |               strip-filename.d.mts
    |   |               strip-filename.d.mts.map
    |   |               trace-mapping.d.cts
    |   |               trace-mapping.d.cts.map
    |   |               trace-mapping.d.mts
    |   |               trace-mapping.d.mts.map
    |   |               types.d.cts
    |   |               types.d.cts.map
    |   |               types.d.mts
    |   |               types.d.mts.map
    |   |               
    |   +---@remix-run
    |   |   \---router
    |   |       |   CHANGELOG.md
    |   |       |   history.ts
    |   |       |   index.ts
    |   |       |   LICENSE.md
    |   |       |   package.json
    |   |       |   README.md
    |   |       |   router.ts
    |   |       |   utils.ts
    |   |       |   
    |   |       \---dist
    |   |               history.d.ts
    |   |               index.d.ts
    |   |               router.cjs.js
    |   |               router.cjs.js.map
    |   |               router.d.ts
    |   |               router.js
    |   |               router.js.map
    |   |               router.umd.js
    |   |               router.umd.js.map
    |   |               router.umd.min.js
    |   |               router.umd.min.js.map
    |   |               utils.d.ts
    |   |               
    |   +---@rolldown
    |   |   \---pluginutils
    |   |       |   LICENSE
    |   |       |   package.json
    |   |       |   
    |   |       \---dist
    |   |               index.cjs
    |   |               index.d.cts
    |   |               index.d.ts
    |   |               index.js
    |   |               
    |   +---@rollup
    |   |   +---rollup-win32-x64-gnu
    |   |   |       package.json
    |   |   |       README.md
    |   |   |       rollup.win32-x64-gnu.node
    |   |   |       
    |   |   \---rollup-win32-x64-msvc
    |   |           package.json
    |   |           README.md
    |   |           rollup.win32-x64-msvc.node
    |   |           
    |   +---@types
    |   |   +---babel__core
    |   |   |       index.d.ts
    |   |   |       LICENSE
    |   |   |       package.json
    |   |   |       README.md
    |   |   |       
    |   |   +---babel__generator
    |   |   |       index.d.ts
    |   |   |       LICENSE
    |   |   |       package.json
    |   |   |       README.md
    |   |   |       
    |   |   +---babel__template
    |   |   |       index.d.ts
    |   |   |       LICENSE
    |   |   |       package.json
    |   |   |       README.md
    |   |   |       
    |   |   +---babel__traverse
    |   |   |       index.d.ts
    |   |   |       LICENSE
    |   |   |       package.json
    |   |   |       README.md
    |   |   |       
    |   |   \---estree
    |   |           flow.d.ts
    |   |           index.d.ts
    |   |           LICENSE
    |   |           package.json
    |   |           README.md
    |   |           
    |   +---@vitejs
    |   |   \---plugin-react
    |   |       |   LICENSE
    |   |       |   package.json
    |   |       |   README.md
    |   |       |   
    |   |       \---dist
    |   |               index.cjs
    |   |               index.d.cts
    |   |               index.d.ts
    |   |               index.js
    |   |               refresh-runtime.js
    |   |               
    |   +---asynckit
    |   |   |   bench.js
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   parallel.js
    |   |   |   README.md
    |   |   |   serial.js
    |   |   |   serialOrdered.js
    |   |   |   stream.js
    |   |   |   
    |   |   \---lib
    |   |           abort.js
    |   |           async.js
    |   |           defer.js
    |   |           iterate.js
    |   |           readable_asynckit.js
    |   |           readable_parallel.js
    |   |           readable_serial.js
    |   |           readable_serial_ordered.js
    |   |           state.js
    |   |           streamify.js
    |   |           terminator.js
    |   |           
    |   +---axios
    |   |   |   CHANGELOG.md
    |   |   |   index.d.cts
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   MIGRATION_GUIDE.md
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   +---dist
    |   |   |   |   axios.js
    |   |   |   |   axios.js.map
    |   |   |   |   axios.min.js
    |   |   |   |   axios.min.js.map
    |   |   |   |   
    |   |   |   +---browser
    |   |   |   |       axios.cjs
    |   |   |   |       axios.cjs.map
    |   |   |   |       
    |   |   |   +---esm
    |   |   |   |       axios.js
    |   |   |   |       axios.js.map
    |   |   |   |       axios.min.js
    |   |   |   |       axios.min.js.map
    |   |   |   |       
    |   |   |   \---node
    |   |   |           axios.cjs
    |   |   |           axios.cjs.map
    |   |   |           
    |   |   \---lib
    |   |       |   axios.js
    |   |       |   utils.js
    |   |       |   
    |   |       +---adapters
    |   |       |       adapters.js
    |   |       |       fetch.js
    |   |       |       http.js
    |   |       |       README.md
    |   |       |       xhr.js
    |   |       |       
    |   |       +---cancel
    |   |       |       CanceledError.js
    |   |       |       CancelToken.js
    |   |       |       isCancel.js
    |   |       |       
    |   |       +---core
    |   |       |       Axios.js
    |   |       |       AxiosError.js
    |   |       |       AxiosHeaders.js
    |   |       |       buildFullPath.js
    |   |       |       dispatchRequest.js
    |   |       |       InterceptorManager.js
    |   |       |       mergeConfig.js
    |   |       |       README.md
    |   |       |       settle.js
    |   |       |       transformData.js
    |   |       |       
    |   |       +---defaults
    |   |       |       index.js
    |   |       |       transitional.js
    |   |       |       
    |   |       +---env
    |   |       |   |   data.js
    |   |       |   |   README.md
    |   |       |   |   
    |   |       |   \---classes
    |   |       |           FormData.js
    |   |       |           
    |   |       +---helpers
    |   |       |       AxiosTransformStream.js
    |   |       |       AxiosURLSearchParams.js
    |   |       |       bind.js
    |   |       |       buildURL.js
    |   |       |       callbackify.js
    |   |       |       combineURLs.js
    |   |       |       composeSignals.js
    |   |       |       cookies.js
    |   |       |       deprecatedMethod.js
    |   |       |       estimateDataURLDecodedBytes.js
    |   |       |       formDataToJSON.js
    |   |       |       formDataToStream.js
    |   |       |       fromDataURI.js
    |   |       |       HttpStatusCode.js
    |   |       |       isAbsoluteURL.js
    |   |       |       isAxiosError.js
    |   |       |       isURLSameOrigin.js
    |   |       |       null.js
    |   |       |       parseHeaders.js
    |   |       |       parseProtocol.js
    |   |       |       progressEventReducer.js
    |   |       |       readBlob.js
    |   |       |       README.md
    |   |       |       resolveConfig.js
    |   |       |       speedometer.js
    |   |       |       spread.js
    |   |       |       throttle.js
    |   |       |       toFormData.js
    |   |       |       toURLEncodedForm.js
    |   |       |       trackStream.js
    |   |       |       validator.js
    |   |       |       ZlibHeaderTransformStream.js
    |   |       |       
    |   |       \---platform
    |   |           |   index.js
    |   |           |   
    |   |           +---browser
    |   |           |   |   index.js
    |   |           |   |   
    |   |           |   \---classes
    |   |           |           Blob.js
    |   |           |           FormData.js
    |   |           |           URLSearchParams.js
    |   |           |           
    |   |           +---common
    |   |           |       utils.js
    |   |           |       
    |   |           \---node
    |   |               |   index.js
    |   |               |   
    |   |               \---classes
    |   |                       FormData.js
    |   |                       URLSearchParams.js
    |   |                       
    |   +---baseline-browser-mapping
    |   |   |   LICENSE.txt
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   \---dist
    |   |           cli.js
    |   |           index.cjs
    |   |           index.d.ts
    |   |           index.js
    |   |           
    |   +---browserslist
    |   |       browser.js
    |   |       cli.js
    |   |       error.d.ts
    |   |       error.js
    |   |       index.d.ts
    |   |       index.js
    |   |       LICENSE
    |   |       node.js
    |   |       package.json
    |   |       parse.js
    |   |       README.md
    |   |       
    |   +---call-bind-apply-helpers
    |   |   |   .eslintrc
    |   |   |   .nycrc
    |   |   |   actualApply.d.ts
    |   |   |   actualApply.js
    |   |   |   applyBind.d.ts
    |   |   |   applyBind.js
    |   |   |   CHANGELOG.md
    |   |   |   functionApply.d.ts
    |   |   |   functionApply.js
    |   |   |   functionCall.d.ts
    |   |   |   functionCall.js
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   reflectApply.d.ts
    |   |   |   reflectApply.js
    |   |   |   tsconfig.json
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   \---test
    |   |           index.js
    |   |           
    |   +---caniuse-lite
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   +---data
    |   |   |   |   agents.js
    |   |   |   |   browsers.js
    |   |   |   |   browserVersions.js
    |   |   |   |   features.js
    |   |   |   |   
    |   |   |   +---features
    |   |   |   |       aac.js
    |   |   |   |       abortcontroller.js
    |   |   |   |       ac3-ec3.js
    |   |   |   |       accelerometer.js
    |   |   |   |       addeventlistener.js
    |   |   |   |       alternate-stylesheet.js
    |   |   |   |       ambient-light.js
    |   |   |   |       apng.js
    |   |   |   |       array-find-index.js
    |   |   |   |       array-find.js
    |   |   |   |       array-flat.js
    |   |   |   |       array-includes.js
    |   |   |   |       arrow-functions.js
    |   |   |   |       asmjs.js
    |   |   |   |       async-clipboard.js
    |   |   |   |       async-functions.js
    |   |   |   |       atob-btoa.js
    |   |   |   |       audio-api.js
    |   |   |   |       audio.js
    |   |   |   |       audiotracks.js
    |   |   |   |       autofocus.js
    |   |   |   |       auxclick.js
    |   |   |   |       av1.js
    |   |   |   |       avif.js
    |   |   |   |       background-attachment.js
    |   |   |   |       background-clip-text.js
    |   |   |   |       background-img-opts.js
    |   |   |   |       background-position-x-y.js
    |   |   |   |       background-repeat-round-space.js
    |   |   |   |       background-sync.js
    |   |   |   |       battery-status.js
    |   |   |   |       beacon.js
    |   |   |   |       beforeafterprint.js
    |   |   |   |       bigint.js
    |   |   |   |       blobbuilder.js
    |   |   |   |       bloburls.js
    |   |   |   |       border-image.js
    |   |   |   |       border-radius.js
    |   |   |   |       broadcastchannel.js
    |   |   |   |       brotli.js
    |   |   |   |       calc.js
    |   |   |   |       canvas-blending.js
    |   |   |   |       canvas-text.js
    |   |   |   |       canvas.js
    |   |   |   |       ch-unit.js
    |   |   |   |       chacha20-poly1305.js
    |   |   |   |       channel-messaging.js
    |   |   |   |       childnode-remove.js
    |   |   |   |       classlist.js
    |   |   |   |       client-hints-dpr-width-viewport.js
    |   |   |   |       clipboard.js
    |   |   |   |       colr-v1.js
    |   |   |   |       colr.js
    |   |   |   |       comparedocumentposition.js
    |   |   |   |       console-basic.js
    |   |   |   |       console-time.js
    |   |   |   |       const.js
    |   |   |   |       constraint-validation.js
    |   |   |   |       contenteditable.js
    |   |   |   |       contentsecuritypolicy.js
    |   |   |   |       contentsecuritypolicy2.js
    |   |   |   |       cookie-store-api.js
    |   |   |   |       cors.js
    |   |   |   |       createimagebitmap.js
    |   |   |   |       credential-management.js
    |   |   |   |       cross-document-view-transitions.js
    |   |   |   |       cryptography.js
    |   |   |   |       css-all.js
    |   |   |   |       css-anchor-positioning.js
    |   |   |   |       css-animation.js
    |   |   |   |       css-any-link.js
    |   |   |   |       css-appearance.js
    |   |   |   |       css-at-counter-style.js
    |   |   |   |       css-autofill.js
    |   |   |   |       css-backdrop-filter.js
    |   |   |   |       css-background-offsets.js
    |   |   |   |       css-backgroundblendmode.js
    |   |   |   |       css-boxdecorationbreak.js
    |   |   |   |       css-boxshadow.js
    |   |   |   |       css-canvas.js
    |   |   |   |       css-caret-color.js
    |   |   |   |       css-cascade-layers.js
    |   |   |   |       css-cascade-scope.js
    |   |   |   |       css-case-insensitive.js
    |   |   |   |       css-clip-path.js
    |   |   |   |       css-color-adjust.js
    |   |   |   |       css-color-function.js
    |   |   |   |       css-conic-gradients.js
    |   |   |   |       css-container-queries-style.js
    |   |   |   |       css-container-queries.js
    |   |   |   |       css-container-query-units.js
    |   |   |   |       css-containment.js
    |   |   |   |       css-content-visibility.js
    |   |   |   |       css-counters.js
    |   |   |   |       css-crisp-edges.js
    |   |   |   |       css-cross-fade.js
    |   |   |   |       css-default-pseudo.js
    |   |   |   |       css-descendant-gtgt.js
    |   |   |   |       css-deviceadaptation.js
    |   |   |   |       css-dir-pseudo.js
    |   |   |   |       css-display-contents.js
    |   |   |   |       css-element-function.js
    |   |   |   |       css-env-function.js
    |   |   |   |       css-exclusions.js
    |   |   |   |       css-featurequeries.js
    |   |   |   |       css-file-selector-button.js
    |   |   |   |       css-filter-function.js
    |   |   |   |       css-filters.js
    |   |   |   |       css-first-letter.js
    |   |   |   |       css-first-line.js
    |   |   |   |       css-fixed.js
    |   |   |   |       css-focus-visible.js
    |   |   |   |       css-focus-within.js
    |   |   |   |       css-font-palette.js
    |   |   |   |       css-font-rendering-controls.js
    |   |   |   |       css-font-stretch.js
    |   |   |   |       css-gencontent.js
    |   |   |   |       css-gradients.js
    |   |   |   |       css-grid-animation.js
    |   |   |   |       css-grid.js
    |   |   |   |       css-hanging-punctuation.js
    |   |   |   |       css-has.js
    |   |   |   |       css-hyphens.js
    |   |   |   |       css-if.js
    |   |   |   |       css-image-orientation.js
    |   |   |   |       css-image-set.js
    |   |   |   |       css-in-out-of-range.js
    |   |   |   |       css-indeterminate-pseudo.js
    |   |   |   |       css-initial-letter.js
    |   |   |   |       css-initial-value.js
    |   |   |   |       css-lch-lab.js
    |   |   |   |       css-letter-spacing.js
    |   |   |   |       css-line-clamp.js
    |   |   |   |       css-logical-props.js
    |   |   |   |       css-marker-pseudo.js
    |   |   |   |       css-masks.js
    |   |   |   |       css-matches-pseudo.js
    |   |   |   |       css-math-functions.js
    |   |   |   |       css-media-interaction.js
    |   |   |   |       css-media-range-syntax.js
    |   |   |   |       css-media-resolution.js
    |   |   |   |       css-media-scripting.js
    |   |   |   |       css-mediaqueries.js
    |   |   |   |       css-mixblendmode.js
    |   |   |   |       css-module-scripts.js
    |   |   |   |       css-motion-paths.js
    |   |   |   |       css-namespaces.js
    |   |   |   |       css-nesting.js
    |   |   |   |       css-not-sel-list.js
    |   |   |   |       css-nth-child-of.js
    |   |   |   |       css-opacity.js
    |   |   |   |       css-optional-pseudo.js
    |   |   |   |       css-overflow-anchor.js
    |   |   |   |       css-overflow-overlay.js
    |   |   |   |       css-overflow.js
    |   |   |   |       css-overscroll-behavior.js
    |   |   |   |       css-page-break.js
    |   |   |   |       css-paged-media.js
    |   |   |   |       css-paint-api.js
    |   |   |   |       css-placeholder-shown.js
    |   |   |   |       css-placeholder.js
    |   |   |   |       css-print-color-adjust.js
    |   |   |   |       css-read-only-write.js
    |   |   |   |       css-rebeccapurple.js
    |   |   |   |       css-reflections.js
    |   |   |   |       css-regions.js
    |   |   |   |       css-relative-colors.js
    |   |   |   |       css-repeating-gradients.js
    |   |   |   |       css-resize.js
    |   |   |   |       css-revert-value.js
    |   |   |   |       css-rrggbbaa.js
    |   |   |   |       css-scroll-behavior.js
    |   |   |   |       css-scrollbar.js
    |   |   |   |       css-sel2.js
    |   |   |   |       css-sel3.js
    |   |   |   |       css-selection.js
    |   |   |   |       css-shapes.js
    |   |   |   |       css-snappoints.js
    |   |   |   |       css-sticky.js
    |   |   |   |       css-subgrid.js
    |   |   |   |       css-supports-api.js
    |   |   |   |       css-table.js
    |   |   |   |       css-text-align-last.js
    |   |   |   |       css-text-box-trim.js
    |   |   |   |       css-text-indent.js
    |   |   |   |       css-text-justify.js
    |   |   |   |       css-text-orientation.js
    |   |   |   |       css-text-spacing.js
    |   |   |   |       css-text-wrap-balance.js
    |   |   |   |       css-textshadow.js
    |   |   |   |       css-touch-action.js
    |   |   |   |       css-transitions.js
    |   |   |   |       css-unicode-bidi.js
    |   |   |   |       css-unset-value.js
    |   |   |   |       css-variables.js
    |   |   |   |       css-when-else.js
    |   |   |   |       css-widows-orphans.js
    |   |   |   |       css-width-stretch.js
    |   |   |   |       css-writing-mode.js
    |   |   |   |       css-zoom.js
    |   |   |   |       css3-attr.js
    |   |   |   |       css3-boxsizing.js
    |   |   |   |       css3-colors.js
    |   |   |   |       css3-cursors-grab.js
    |   |   |   |       css3-cursors-newer.js
    |   |   |   |       css3-cursors.js
    |   |   |   |       css3-tabsize.js
    |   |   |   |       currentcolor.js
    |   |   |   |       custom-elements.js
    |   |   |   |       custom-elementsv1.js
    |   |   |   |       customevent.js
    |   |   |   |       datalist.js
    |   |   |   |       dataset.js
    |   |   |   |       datauri.js
    |   |   |   |       date-tolocaledatestring.js
    |   |   |   |       declarative-shadow-dom.js
    |   |   |   |       decorators.js
    |   |   |   |       details.js
    |   |   |   |       deviceorientation.js
    |   |   |   |       devicepixelratio.js
    |   |   |   |       dialog.js
    |   |   |   |       dispatchevent.js
    |   |   |   |       dnssec.js
    |   |   |   |       do-not-track.js
    |   |   |   |       document-currentscript.js
    |   |   |   |       document-evaluate-xpath.js
    |   |   |   |       document-execcommand.js
    |   |   |   |       document-policy.js
    |   |   |   |       document-scrollingelement.js
    |   |   |   |       documenthead.js
    |   |   |   |       dom-manip-convenience.js
    |   |   |   |       dom-range.js
    |   |   |   |       domcontentloaded.js
    |   |   |   |       dommatrix.js
    |   |   |   |       download.js
    |   |   |   |       dragndrop.js
    |   |   |   |       element-closest.js
    |   |   |   |       element-from-point.js
    |   |   |   |       element-scroll-methods.js
    |   |   |   |       eme.js
    |   |   |   |       eot.js
    |   |   |   |       es5.js
    |   |   |   |       es6-class.js
    |   |   |   |       es6-generators.js
    |   |   |   |       es6-module-dynamic-import.js
    |   |   |   |       es6-module.js
    |   |   |   |       es6-number.js
    |   |   |   |       es6-string-includes.js
    |   |   |   |       es6.js
    |   |   |   |       eventsource.js
    |   |   |   |       extended-system-fonts.js
    |   |   |   |       feature-policy.js
    |   |   |   |       fetch.js
    |   |   |   |       fieldset-disabled.js
    |   |   |   |       fileapi.js
    |   |   |   |       filereader.js
    |   |   |   |       filereadersync.js
    |   |   |   |       filesystem.js
    |   |   |   |       flac.js
    |   |   |   |       flexbox-gap.js
    |   |   |   |       flexbox.js
    |   |   |   |       flow-root.js
    |   |   |   |       focusin-focusout-events.js
    |   |   |   |       font-family-system-ui.js
    |   |   |   |       font-feature.js
    |   |   |   |       font-kerning.js
    |   |   |   |       font-loading.js
    |   |   |   |       font-size-adjust.js
    |   |   |   |       font-smooth.js
    |   |   |   |       font-unicode-range.js
    |   |   |   |       font-variant-alternates.js
    |   |   |   |       font-variant-numeric.js
    |   |   |   |       fontface.js
    |   |   |   |       form-attribute.js
    |   |   |   |       form-submit-attributes.js
    |   |   |   |       form-validation.js
    |   |   |   |       forms.js
    |   |   |   |       fullscreen.js
    |   |   |   |       gamepad.js
    |   |   |   |       geolocation.js
    |   |   |   |       getboundingclientrect.js
    |   |   |   |       getcomputedstyle.js
    |   |   |   |       getelementsbyclassname.js
    |   |   |   |       getrandomvalues.js
    |   |   |   |       gyroscope.js
    |   |   |   |       hardwareconcurrency.js
    |   |   |   |       hashchange.js
    |   |   |   |       heif.js
    |   |   |   |       hevc.js
    |   |   |   |       hidden.js
    |   |   |   |       high-resolution-time.js
    |   |   |   |       history.js
    |   |   |   |       html-media-capture.js
    |   |   |   |       html5semantic.js
    |   |   |   |       http-live-streaming.js
    |   |   |   |       http2.js
    |   |   |   |       http3.js
    |   |   |   |       iframe-sandbox.js
    |   |   |   |       iframe-seamless.js
    |   |   |   |       iframe-srcdoc.js
    |   |   |   |       imagecapture.js
    |   |   |   |       ime.js
    |   |   |   |       img-naturalwidth-naturalheight.js
    |   |   |   |       import-maps.js
    |   |   |   |       imports.js
    |   |   |   |       indeterminate-checkbox.js
    |   |   |   |       indexeddb.js
    |   |   |   |       indexeddb2.js
    |   |   |   |       inline-block.js
    |   |   |   |       innertext.js
    |   |   |   |       input-autocomplete-onoff.js
    |   |   |   |       input-color.js
    |   |   |   |       input-datetime.js
    |   |   |   |       input-email-tel-url.js
    |   |   |   |       input-event.js
    |   |   |   |       input-file-accept.js
    |   |   |   |       input-file-directory.js
    |   |   |   |       input-file-multiple.js
    |   |   |   |       input-inputmode.js
    |   |   |   |       input-minlength.js
    |   |   |   |       input-number.js
    |   |   |   |       input-pattern.js
    |   |   |   |       input-placeholder.js
    |   |   |   |       input-range.js
    |   |   |   |       input-search.js
    |   |   |   |       input-selection.js
    |   |   |   |       insert-adjacent.js
    |   |   |   |       insertadjacenthtml.js
    |   |   |   |       internationalization.js
    |   |   |   |       intersectionobserver-v2.js
    |   |   |   |       intersectionobserver.js
    |   |   |   |       intl-pluralrules.js
    |   |   |   |       intrinsic-width.js
    |   |   |   |       jpeg2000.js
    |   |   |   |       jpegxl.js
    |   |   |   |       jpegxr.js
    |   |   |   |       js-regexp-lookbehind.js
    |   |   |   |       json.js
    |   |   |   |       justify-content-space-evenly.js
    |   |   |   |       kerning-pairs-ligatures.js
    |   |   |   |       keyboardevent-charcode.js
    |   |   |   |       keyboardevent-code.js
    |   |   |   |       keyboardevent-getmodifierstate.js
    |   |   |   |       keyboardevent-key.js
    |   |   |   |       keyboardevent-location.js
    |   |   |   |       keyboardevent-which.js
    |   |   |   |       lazyload.js
    |   |   |   |       let.js
    |   |   |   |       link-icon-png.js
    |   |   |   |       link-icon-svg.js
    |   |   |   |       link-rel-dns-prefetch.js
    |   |   |   |       link-rel-modulepreload.js
    |   |   |   |       link-rel-preconnect.js
    |   |   |   |       link-rel-prefetch.js
    |   |   |   |       link-rel-preload.js
    |   |   |   |       link-rel-prerender.js
    |   |   |   |       loading-lazy-attr.js
    |   |   |   |       localecompare.js
    |   |   |   |       magnetometer.js
    |   |   |   |       matchesselector.js
    |   |   |   |       matchmedia.js
    |   |   |   |       mathml.js
    |   |   |   |       maxlength.js
    |   |   |   |       mdn-css-backdrop-pseudo-element.js
    |   |   |   |       mdn-css-unicode-bidi-isolate-override.js
    |   |   |   |       mdn-css-unicode-bidi-isolate.js
    |   |   |   |       mdn-css-unicode-bidi-plaintext.js
    |   |   |   |       mdn-text-decoration-color.js
    |   |   |   |       mdn-text-decoration-line.js
    |   |   |   |       mdn-text-decoration-shorthand.js
    |   |   |   |       mdn-text-decoration-style.js
    |   |   |   |       media-fragments.js
    |   |   |   |       mediacapture-fromelement.js
    |   |   |   |       mediarecorder.js
    |   |   |   |       mediasource.js
    |   |   |   |       menu.js
    |   |   |   |       meta-theme-color.js
    |   |   |   |       meter.js
    |   |   |   |       midi.js
    |   |   |   |       minmaxwh.js
    |   |   |   |       mp3.js
    |   |   |   |       mpeg-dash.js
    |   |   |   |       mpeg4.js
    |   |   |   |       multibackgrounds.js
    |   |   |   |       multicolumn.js
    |   |   |   |       mutation-events.js
    |   |   |   |       mutationobserver.js
    |   |   |   |       namevalue-storage.js
    |   |   |   |       native-filesystem-api.js
    |   |   |   |       nav-timing.js
    |   |   |   |       netinfo.js
    |   |   |   |       notifications.js
    |   |   |   |       object-entries.js
    |   |   |   |       object-fit.js
    |   |   |   |       object-observe.js
    |   |   |   |       object-values.js
    |   |   |   |       objectrtc.js
    |   |   |   |       offline-apps.js
    |   |   |   |       offscreencanvas.js
    |   |   |   |       ogg-vorbis.js
    |   |   |   |       ogv.js
    |   |   |   |       ol-reversed.js
    |   |   |   |       once-event-listener.js
    |   |   |   |       online-status.js
    |   |   |   |       opus.js
    |   |   |   |       orientation-sensor.js
    |   |   |   |       outline.js
    |   |   |   |       pad-start-end.js
    |   |   |   |       page-transition-events.js
    |   |   |   |       pagevisibility.js
    |   |   |   |       passive-event-listener.js
    |   |   |   |       passkeys.js
    |   |   |   |       passwordrules.js
    |   |   |   |       path2d.js
    |   |   |   |       payment-request.js
    |   |   |   |       pdf-viewer.js
    |   |   |   |       permissions-api.js
    |   |   |   |       permissions-policy.js
    |   |   |   |       picture-in-picture.js
    |   |   |   |       picture.js
    |   |   |   |       ping.js
    |   |   |   |       png-alpha.js
    |   |   |   |       pointer-events.js
    |   |   |   |       pointer.js
    |   |   |   |       pointerlock.js
    |   |   |   |       portals.js
    |   |   |   |       prefers-color-scheme.js
    |   |   |   |       prefers-reduced-motion.js
    |   |   |   |       progress.js
    |   |   |   |       promise-finally.js
    |   |   |   |       promises.js
    |   |   |   |       proximity.js
    |   |   |   |       proxy.js
    |   |   |   |       publickeypinning.js
    |   |   |   |       push-api.js
    |   |   |   |       queryselector.js
    |   |   |   |       readonly-attr.js
    |   |   |   |       referrer-policy.js
    |   |   |   |       registerprotocolhandler.js
    |   |   |   |       rel-noopener.js
    |   |   |   |       rel-noreferrer.js
    |   |   |   |       rellist.js
    |   |   |   |       rem.js
    |   |   |   |       requestanimationframe.js
    |   |   |   |       requestidlecallback.js
    |   |   |   |       resizeobserver.js
    |   |   |   |       resource-timing.js
    |   |   |   |       rest-parameters.js
    |   |   |   |       rtcpeerconnection.js
    |   |   |   |       ruby.js
    |   |   |   |       run-in.js
    |   |   |   |       same-site-cookie-attribute.js
    |   |   |   |       screen-orientation.js
    |   |   |   |       script-async.js
    |   |   |   |       script-defer.js
    |   |   |   |       scrollintoview.js
    |   |   |   |       scrollintoviewifneeded.js
    |   |   |   |       sdch.js
    |   |   |   |       selection-api.js
    |   |   |   |       selectlist.js
    |   |   |   |       server-timing.js
    |   |   |   |       serviceworkers.js
    |   |   |   |       setimmediate.js
    |   |   |   |       shadowdom.js
    |   |   |   |       shadowdomv1.js
    |   |   |   |       sharedarraybuffer.js
    |   |   |   |       sharedworkers.js
    |   |   |   |       sni.js
    |   |   |   |       spdy.js
    |   |   |   |       speech-recognition.js
    |   |   |   |       speech-synthesis.js
    |   |   |   |       spellcheck-attribute.js
    |   |   |   |       sql-storage.js
    |   |   |   |       srcset.js
    |   |   |   |       stream.js
    |   |   |   |       streams.js
    |   |   |   |       stricttransportsecurity.js
    |   |   |   |       style-scoped.js
    |   |   |   |       subresource-bundling.js
    |   |   |   |       subresource-integrity.js
    |   |   |   |       svg-css.js
    |   |   |   |       svg-filters.js
    |   |   |   |       svg-fonts.js
    |   |   |   |       svg-fragment.js
    |   |   |   |       svg-html.js
    |   |   |   |       svg-html5.js
    |   |   |   |       svg-img.js
    |   |   |   |       svg-smil.js
    |   |   |   |       svg.js
    |   |   |   |       sxg.js
    |   |   |   |       tabindex-attr.js
    |   |   |   |       template-literals.js
    |   |   |   |       template.js
    |   |   |   |       temporal.js
    |   |   |   |       testfeat.js
    |   |   |   |       text-decoration.js
    |   |   |   |       text-emphasis.js
    |   |   |   |       text-overflow.js
    |   |   |   |       text-size-adjust.js
    |   |   |   |       text-stroke.js
    |   |   |   |       textcontent.js
    |   |   |   |       textencoder.js
    |   |   |   |       tls1-1.js
    |   |   |   |       tls1-2.js
    |   |   |   |       tls1-3.js
    |   |   |   |       touch.js
    |   |   |   |       transforms2d.js
    |   |   |   |       transforms3d.js
    |   |   |   |       trusted-types.js
    |   |   |   |       ttf.js
    |   |   |   |       typedarrays.js
    |   |   |   |       u2f.js
    |   |   |   |       unhandledrejection.js
    |   |   |   |       upgradeinsecurerequests.js
    |   |   |   |       url-scroll-to-text-fragment.js
    |   |   |   |       url.js
    |   |   |   |       urlsearchparams.js
    |   |   |   |       use-strict.js
    |   |   |   |       user-select-none.js
    |   |   |   |       user-timing.js
    |   |   |   |       variable-fonts.js
    |   |   |   |       vector-effect.js
    |   |   |   |       vibration.js
    |   |   |   |       video.js
    |   |   |   |       videotracks.js
    |   |   |   |       view-transitions.js
    |   |   |   |       viewport-unit-variants.js
    |   |   |   |       viewport-units.js
    |   |   |   |       wai-aria.js
    |   |   |   |       wake-lock.js
    |   |   |   |       wasm-bigint.js
    |   |   |   |       wasm-bulk-memory.js
    |   |   |   |       wasm-extended-const.js
    |   |   |   |       wasm-gc.js
    |   |   |   |       wasm-multi-memory.js
    |   |   |   |       wasm-multi-value.js
    |   |   |   |       wasm-mutable-globals.js
    |   |   |   |       wasm-nontrapping-fptoint.js
    |   |   |   |       wasm-reference-types.js
    |   |   |   |       wasm-relaxed-simd.js
    |   |   |   |       wasm-signext.js
    |   |   |   |       wasm-simd.js
    |   |   |   |       wasm-tail-calls.js
    |   |   |   |       wasm-threads.js
    |   |   |   |       wasm.js
    |   |   |   |       wav.js
    |   |   |   |       wbr-element.js
    |   |   |   |       web-animation.js
    |   |   |   |       web-app-manifest.js
    |   |   |   |       web-bluetooth.js
    |   |   |   |       web-serial.js
    |   |   |   |       web-share.js
    |   |   |   |       webauthn.js
    |   |   |   |       webcodecs.js
    |   |   |   |       webgl.js
    |   |   |   |       webgl2.js
    |   |   |   |       webgpu.js
    |   |   |   |       webhid.js
    |   |   |   |       webkit-user-drag.js
    |   |   |   |       webm.js
    |   |   |   |       webnfc.js
    |   |   |   |       webp.js
    |   |   |   |       websockets.js
    |   |   |   |       webtransport.js
    |   |   |   |       webusb.js
    |   |   |   |       webvr.js
    |   |   |   |       webvtt.js
    |   |   |   |       webworkers.js
    |   |   |   |       webxr.js
    |   |   |   |       will-change.js
    |   |   |   |       woff.js
    |   |   |   |       woff2.js
    |   |   |   |       word-break.js
    |   |   |   |       wordwrap.js
    |   |   |   |       x-doc-messaging.js
    |   |   |   |       x-frame-options.js
    |   |   |   |       xhr2.js
    |   |   |   |       xhtml.js
    |   |   |   |       xhtmlsmil.js
    |   |   |   |       xml-serializer.js
    |   |   |   |       zstd.js
    |   |   |   |       
    |   |   |   \---regions
    |   |   |           AD.js
    |   |   |           AE.js
    |   |   |           AF.js
    |   |   |           AG.js
    |   |   |           AI.js
    |   |   |           AL.js
    |   |   |           alt-af.js
    |   |   |           alt-an.js
    |   |   |           alt-as.js
    |   |   |           alt-eu.js
    |   |   |           alt-na.js
    |   |   |           alt-oc.js
    |   |   |           alt-sa.js
    |   |   |           alt-ww.js
    |   |   |           AM.js
    |   |   |           AO.js
    |   |   |           AR.js
    |   |   |           AS.js
    |   |   |           AT.js
    |   |   |           AU.js
    |   |   |           AW.js
    |   |   |           AX.js
    |   |   |           AZ.js
    |   |   |           BA.js
    |   |   |           BB.js
    |   |   |           BD.js
    |   |   |           BE.js
    |   |   |           BF.js
    |   |   |           BG.js
    |   |   |           BH.js
    |   |   |           BI.js
    |   |   |           BJ.js
    |   |   |           BM.js
    |   |   |           BN.js
    |   |   |           BO.js
    |   |   |           BR.js
    |   |   |           BS.js
    |   |   |           BT.js
    |   |   |           BW.js
    |   |   |           BY.js
    |   |   |           BZ.js
    |   |   |           CA.js
    |   |   |           CD.js
    |   |   |           CF.js
    |   |   |           CG.js
    |   |   |           CH.js
    |   |   |           CI.js
    |   |   |           CK.js
    |   |   |           CL.js
    |   |   |           CM.js
    |   |   |           CN.js
    |   |   |           CO.js
    |   |   |           CR.js
    |   |   |           CU.js
    |   |   |           CV.js
    |   |   |           CX.js
    |   |   |           CY.js
    |   |   |           CZ.js
    |   |   |           DE.js
    |   |   |           DJ.js
    |   |   |           DK.js
    |   |   |           DM.js
    |   |   |           DO.js
    |   |   |           DZ.js
    |   |   |           EC.js
    |   |   |           EE.js
    |   |   |           EG.js
    |   |   |           ER.js
    |   |   |           ES.js
    |   |   |           ET.js
    |   |   |           FI.js
    |   |   |           FJ.js
    |   |   |           FK.js
    |   |   |           FM.js
    |   |   |           FO.js
    |   |   |           FR.js
    |   |   |           GA.js
    |   |   |           GB.js
    |   |   |           GD.js
    |   |   |           GE.js
    |   |   |           GF.js
    |   |   |           GG.js
    |   |   |           GH.js
    |   |   |           GI.js
    |   |   |           GL.js
    |   |   |           GM.js
    |   |   |           GN.js
    |   |   |           GP.js
    |   |   |           GQ.js
    |   |   |           GR.js
    |   |   |           GT.js
    |   |   |           GU.js
    |   |   |           GW.js
    |   |   |           GY.js
    |   |   |           HK.js
    |   |   |           HN.js
    |   |   |           HR.js
    |   |   |           HT.js
    |   |   |           HU.js
    |   |   |           ID.js
    |   |   |           IE.js
    |   |   |           IL.js
    |   |   |           IM.js
    |   |   |           IN.js
    |   |   |           IQ.js
    |   |   |           IR.js
    |   |   |           IS.js
    |   |   |           IT.js
    |   |   |           JE.js
    |   |   |           JM.js
    |   |   |           JO.js
    |   |   |           JP.js
    |   |   |           KE.js
    |   |   |           KG.js
    |   |   |           KH.js
    |   |   |           KI.js
    |   |   |           KM.js
    |   |   |           KN.js
    |   |   |           KP.js
    |   |   |           KR.js
    |   |   |           KW.js
    |   |   |           KY.js
    |   |   |           KZ.js
    |   |   |           LA.js
    |   |   |           LB.js
    |   |   |           LC.js
    |   |   |           LI.js
    |   |   |           LK.js
    |   |   |           LR.js
    |   |   |           LS.js
    |   |   |           LT.js
    |   |   |           LU.js
    |   |   |           LV.js
    |   |   |           LY.js
    |   |   |           MA.js
    |   |   |           MC.js
    |   |   |           MD.js
    |   |   |           ME.js
    |   |   |           MG.js
    |   |   |           MH.js
    |   |   |           MK.js
    |   |   |           ML.js
    |   |   |           MM.js
    |   |   |           MN.js
    |   |   |           MO.js
    |   |   |           MP.js
    |   |   |           MQ.js
    |   |   |           MR.js
    |   |   |           MS.js
    |   |   |           MT.js
    |   |   |           MU.js
    |   |   |           MV.js
    |   |   |           MW.js
    |   |   |           MX.js
    |   |   |           MY.js
    |   |   |           MZ.js
    |   |   |           NA.js
    |   |   |           NC.js
    |   |   |           NE.js
    |   |   |           NF.js
    |   |   |           NG.js
    |   |   |           NI.js
    |   |   |           NL.js
    |   |   |           NO.js
    |   |   |           NP.js
    |   |   |           NR.js
    |   |   |           NU.js
    |   |   |           NZ.js
    |   |   |           OM.js
    |   |   |           PA.js
    |   |   |           PE.js
    |   |   |           PF.js
    |   |   |           PG.js
    |   |   |           PH.js
    |   |   |           PK.js
    |   |   |           PL.js
    |   |   |           PM.js
    |   |   |           PN.js
    |   |   |           PR.js
    |   |   |           PS.js
    |   |   |           PT.js
    |   |   |           PW.js
    |   |   |           PY.js
    |   |   |           QA.js
    |   |   |           RE.js
    |   |   |           RO.js
    |   |   |           RS.js
    |   |   |           RU.js
    |   |   |           RW.js
    |   |   |           SA.js
    |   |   |           SB.js
    |   |   |           SC.js
    |   |   |           SD.js
    |   |   |           SE.js
    |   |   |           SG.js
    |   |   |           SH.js
    |   |   |           SI.js
    |   |   |           SK.js
    |   |   |           SL.js
    |   |   |           SM.js
    |   |   |           SN.js
    |   |   |           SO.js
    |   |   |           SR.js
    |   |   |           ST.js
    |   |   |           SV.js
    |   |   |           SY.js
    |   |   |           SZ.js
    |   |   |           TC.js
    |   |   |           TD.js
    |   |   |           TG.js
    |   |   |           TH.js
    |   |   |           TJ.js
    |   |   |           TL.js
    |   |   |           TM.js
    |   |   |           TN.js
    |   |   |           TO.js
    |   |   |           TR.js
    |   |   |           TT.js
    |   |   |           TV.js
    |   |   |           TW.js
    |   |   |           TZ.js
    |   |   |           UA.js
    |   |   |           UG.js
    |   |   |           US.js
    |   |   |           UY.js
    |   |   |           UZ.js
    |   |   |           VA.js
    |   |   |           VC.js
    |   |   |           VE.js
    |   |   |           VG.js
    |   |   |           VI.js
    |   |   |           VN.js
    |   |   |           VU.js
    |   |   |           WF.js
    |   |   |           WS.js
    |   |   |           YE.js
    |   |   |           YT.js
    |   |   |           ZA.js
    |   |   |           ZM.js
    |   |   |           ZW.js
    |   |   |           
    |   |   \---dist
    |   |       +---lib
    |   |       |       statuses.js
    |   |       |       supported.js
    |   |       |       
    |   |       \---unpacker
    |   |               agents.js
    |   |               browsers.js
    |   |               browserVersions.js
    |   |               feature.js
    |   |               features.js
    |   |               index.js
    |   |               region.js
    |   |               
    |   +---combined-stream
    |   |   |   License
    |   |   |   package.json
    |   |   |   Readme.md
    |   |   |   yarn.lock
    |   |   |   
    |   |   \---lib
    |   |           combined_stream.js
    |   |           
    |   +---convert-source-map
    |   |       index.js
    |   |       LICENSE
    |   |       package.json
    |   |       README.md
    |   |       
    |   +---debug
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   \---src
    |   |           browser.js
    |   |           common.js
    |   |           index.js
    |   |           node.js
    |   |           
    |   +---delayed-stream
    |   |   |   .npmignore
    |   |   |   License
    |   |   |   Makefile
    |   |   |   package.json
    |   |   |   Readme.md
    |   |   |   
    |   |   \---lib
    |   |           delayed_stream.js
    |   |           
    |   +---dunder-proto
    |   |   |   .eslintrc
    |   |   |   .nycrc
    |   |   |   CHANGELOG.md
    |   |   |   get.d.ts
    |   |   |   get.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   set.d.ts
    |   |   |   set.js
    |   |   |   tsconfig.json
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   \---test
    |   |           get.js
    |   |           index.js
    |   |           set.js
    |   |           
    |   +---electron-to-chromium
    |   |       chromium-versions.js
    |   |       chromium-versions.json
    |   |       full-chromium-versions.js
    |   |       full-chromium-versions.json
    |   |       full-versions.js
    |   |       full-versions.json
    |   |       index.js
    |   |       LICENSE
    |   |       package.json
    |   |       README.md
    |   |       versions.js
    |   |       versions.json
    |   |       
    |   +---es-define-property
    |   |   |   .eslintrc
    |   |   |   .nycrc
    |   |   |   CHANGELOG.md
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   tsconfig.json
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   \---test
    |   |           index.js
    |   |           
    |   +---es-errors
    |   |   |   .eslintrc
    |   |   |   CHANGELOG.md
    |   |   |   eval.d.ts
    |   |   |   eval.js
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   range.d.ts
    |   |   |   range.js
    |   |   |   README.md
    |   |   |   ref.d.ts
    |   |   |   ref.js
    |   |   |   syntax.d.ts
    |   |   |   syntax.js
    |   |   |   tsconfig.json
    |   |   |   type.d.ts
    |   |   |   type.js
    |   |   |   uri.d.ts
    |   |   |   uri.js
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   \---test
    |   |           index.js
    |   |           
    |   +---es-object-atoms
    |   |   |   .eslintrc
    |   |   |   CHANGELOG.md
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   isObject.d.ts
    |   |   |   isObject.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   RequireObjectCoercible.d.ts
    |   |   |   RequireObjectCoercible.js
    |   |   |   ToObject.d.ts
    |   |   |   ToObject.js
    |   |   |   tsconfig.json
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   \---test
    |   |           index.js
    |   |           
    |   +---es-set-tostringtag
    |   |   |   .eslintrc
    |   |   |   .nycrc
    |   |   |   CHANGELOG.md
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   tsconfig.json
    |   |   |   
    |   |   \---test
    |   |           index.js
    |   |           
    |   +---esbuild
    |   |   |   install.js
    |   |   |   LICENSE.md
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   +---bin
    |   |   |       esbuild
    |   |   |       
    |   |   \---lib
    |   |           main.d.ts
    |   |           main.js
    |   |           
    |   +---escalade
    |   |   |   index.d.mts
    |   |   |   index.d.ts
    |   |   |   license
    |   |   |   package.json
    |   |   |   readme.md
    |   |   |   
    |   |   +---dist
    |   |   |       index.js
    |   |   |       index.mjs
    |   |   |       
    |   |   \---sync
    |   |           index.d.mts
    |   |           index.d.ts
    |   |           index.js
    |   |           index.mjs
    |   |           
    |   +---follow-redirects
    |   |       debug.js
    |   |       http.js
    |   |       https.js
    |   |       index.js
    |   |       LICENSE
    |   |       package.json
    |   |       README.md
    |   |       
    |   +---form-data
    |   |   |   CHANGELOG.md
    |   |   |   index.d.ts
    |   |   |   License
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   \---lib
    |   |           browser.js
    |   |           form_data.js
    |   |           populate.js
    |   |           
    |   +---function-bind
    |   |   |   .eslintrc
    |   |   |   .nycrc
    |   |   |   CHANGELOG.md
    |   |   |   implementation.js
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       SECURITY.md
    |   |   |       
    |   |   \---test
    |   |           .eslintrc
    |   |           index.js
    |   |           
    |   +---gensync
    |   |   |   index.js
    |   |   |   index.js.flow
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   \---test
    |   |           .babelrc
    |   |           index.test.js
    |   |           
    |   +---get-intrinsic
    |   |   |   .eslintrc
    |   |   |   .nycrc
    |   |   |   CHANGELOG.md
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   \---test
    |   |           GetIntrinsic.js
    |   |           
    |   +---get-proto
    |   |   |   .eslintrc
    |   |   |   .nycrc
    |   |   |   CHANGELOG.md
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   Object.getPrototypeOf.d.ts
    |   |   |   Object.getPrototypeOf.js
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   Reflect.getPrototypeOf.d.ts
    |   |   |   Reflect.getPrototypeOf.js
    |   |   |   tsconfig.json
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   \---test
    |   |           index.js
    |   |           
    |   +---gopd
    |   |   |   .eslintrc
    |   |   |   CHANGELOG.md
    |   |   |   gOPD.d.ts
    |   |   |   gOPD.js
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   tsconfig.json
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   \---test
    |   |           index.js
    |   |           
    |   +---has-symbols
    |   |   |   .eslintrc
    |   |   |   .nycrc
    |   |   |   CHANGELOG.md
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   shams.d.ts
    |   |   |   shams.js
    |   |   |   tsconfig.json
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   \---test
    |   |       |   index.js
    |   |       |   tests.js
    |   |       |   
    |   |       \---shams
    |   |               core-js.js
    |   |               get-own-property-symbols.js
    |   |               
    |   +---has-tostringtag
    |   |   |   .eslintrc
    |   |   |   .nycrc
    |   |   |   CHANGELOG.md
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   shams.d.ts
    |   |   |   shams.js
    |   |   |   tsconfig.json
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   \---test
    |   |       |   index.js
    |   |       |   tests.js
    |   |       |   
    |   |       \---shams
    |   |               core-js.js
    |   |               get-own-property-symbols.js
    |   |               
    |   +---hasown
    |   |   |   .eslintrc
    |   |   |   .nycrc
    |   |   |   CHANGELOG.md
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   tsconfig.json
    |   |   |   
    |   |   \---.github
    |   |           FUNDING.yml
    |   |           
    |   +---js-tokens
    |   |       CHANGELOG.md
    |   |       index.js
    |   |       LICENSE
    |   |       package.json
    |   |       README.md
    |   |       
    |   +---jsesc
    |   |   |   jsesc.js
    |   |   |   LICENSE-MIT.txt
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   +---bin
    |   |   |       jsesc
    |   |   |       
    |   |   \---man
    |   |           jsesc.1
    |   |           
    |   +---json5
    |   |   |   LICENSE.md
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   +---dist
    |   |   |       index.js
    |   |   |       index.min.js
    |   |   |       index.min.mjs
    |   |   |       index.mjs
    |   |   |       
    |   |   \---lib
    |   |           cli.js
    |   |           index.d.ts
    |   |           index.js
    |   |           parse.d.ts
    |   |           parse.js
    |   |           register.js
    |   |           require.js
    |   |           stringify.d.ts
    |   |           stringify.js
    |   |           unicode.d.ts
    |   |           unicode.js
    |   |           util.d.ts
    |   |           util.js
    |   |           
    |   +---loose-envify
    |   |       cli.js
    |   |       custom.js
    |   |       index.js
    |   |       LICENSE
    |   |       loose-envify.js
    |   |       package.json
    |   |       README.md
    |   |       replace.js
    |   |       
    |   +---lru-cache
    |   |       index.js
    |   |       LICENSE
    |   |       package.json
    |   |       README.md
    |   |       
    |   +---math-intrinsics
    |   |   |   .eslintrc
    |   |   |   abs.d.ts
    |   |   |   abs.js
    |   |   |   CHANGELOG.md
    |   |   |   floor.d.ts
    |   |   |   floor.js
    |   |   |   isFinite.d.ts
    |   |   |   isFinite.js
    |   |   |   isInteger.d.ts
    |   |   |   isInteger.js
    |   |   |   isNaN.d.ts
    |   |   |   isNaN.js
    |   |   |   isNegativeZero.d.ts
    |   |   |   isNegativeZero.js
    |   |   |   LICENSE
    |   |   |   max.d.ts
    |   |   |   max.js
    |   |   |   min.d.ts
    |   |   |   min.js
    |   |   |   mod.d.ts
    |   |   |   mod.js
    |   |   |   package.json
    |   |   |   pow.d.ts
    |   |   |   pow.js
    |   |   |   README.md
    |   |   |   round.d.ts
    |   |   |   round.js
    |   |   |   sign.d.ts
    |   |   |   sign.js
    |   |   |   tsconfig.json
    |   |   |   
    |   |   +---.github
    |   |   |       FUNDING.yml
    |   |   |       
    |   |   +---constants
    |   |   |       maxArrayLength.d.ts
    |   |   |       maxArrayLength.js
    |   |   |       maxSafeInteger.d.ts
    |   |   |       maxSafeInteger.js
    |   |   |       maxValue.d.ts
    |   |   |       maxValue.js
    |   |   |       
    |   |   \---test
    |   |           index.js
    |   |           
    |   +---mime-db
    |   |       db.json
    |   |       HISTORY.md
    |   |       index.js
    |   |       LICENSE
    |   |       package.json
    |   |       README.md
    |   |       
    |   +---mime-types
    |   |       HISTORY.md
    |   |       index.js
    |   |       LICENSE
    |   |       package.json
    |   |       README.md
    |   |       
    |   +---ms
    |   |       index.js
    |   |       license.md
    |   |       package.json
    |   |       readme.md
    |   |       
    |   +---nanoid
    |   |   |   index.browser.cjs
    |   |   |   index.browser.js
    |   |   |   index.cjs
    |   |   |   index.d.cts
    |   |   |   index.d.ts
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   nanoid.js
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   +---async
    |   |   |       index.browser.cjs
    |   |   |       index.browser.js
    |   |   |       index.cjs
    |   |   |       index.d.ts
    |   |   |       index.js
    |   |   |       index.native.js
    |   |   |       package.json
    |   |   |       
    |   |   +---bin
    |   |   |       nanoid.cjs
    |   |   |       
    |   |   +---non-secure
    |   |   |       index.cjs
    |   |   |       index.d.ts
    |   |   |       index.js
    |   |   |       package.json
    |   |   |       
    |   |   \---url-alphabet
    |   |           index.cjs
    |   |           index.js
    |   |           package.json
    |   |           
    |   +---node-releases
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   \---data
    |   |       +---processed
    |   |       |       envs.json
    |   |       |       
    |   |       \---release-schedule
    |   |               release-schedule.json
    |   |               
    |   +---picocolors
    |   |       LICENSE
    |   |       package.json
    |   |       picocolors.browser.js
    |   |       picocolors.d.ts
    |   |       picocolors.js
    |   |       README.md
    |   |       types.d.ts
    |   |       
    |   +---postcss
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   \---lib
    |   |           at-rule.d.ts
    |   |           at-rule.js
    |   |           comment.d.ts
    |   |           comment.js
    |   |           container.d.ts
    |   |           container.js
    |   |           css-syntax-error.d.ts
    |   |           css-syntax-error.js
    |   |           declaration.d.ts
    |   |           declaration.js
    |   |           document.d.ts
    |   |           document.js
    |   |           fromJSON.d.ts
    |   |           fromJSON.js
    |   |           input.d.ts
    |   |           input.js
    |   |           lazy-result.d.ts
    |   |           lazy-result.js
    |   |           list.d.ts
    |   |           list.js
    |   |           map-generator.js
    |   |           no-work-result.d.ts
    |   |           no-work-result.js
    |   |           node.d.ts
    |   |           node.js
    |   |           parse.d.ts
    |   |           parse.js
    |   |           parser.js
    |   |           postcss.d.mts
    |   |           postcss.d.ts
    |   |           postcss.js
    |   |           postcss.mjs
    |   |           previous-map.d.ts
    |   |           previous-map.js
    |   |           processor.d.ts
    |   |           processor.js
    |   |           result.d.ts
    |   |           result.js
    |   |           root.d.ts
    |   |           root.js
    |   |           rule.d.ts
    |   |           rule.js
    |   |           stringifier.d.ts
    |   |           stringifier.js
    |   |           stringify.d.ts
    |   |           stringify.js
    |   |           symbols.js
    |   |           terminal-highlight.js
    |   |           tokenize.js
    |   |           warn-once.js
    |   |           warning.d.ts
    |   |           warning.js
    |   |           
    |   +---proxy-from-env
    |   |       .eslintrc
    |   |       .travis.yml
    |   |       index.js
    |   |       LICENSE
    |   |       package.json
    |   |       README.md
    |   |       test.js
    |   |       
    |   +---react
    |   |   |   index.js
    |   |   |   jsx-dev-runtime.js
    |   |   |   jsx-runtime.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   react.shared-subset.js
    |   |   |   README.md
    |   |   |   
    |   |   +---cjs
    |   |   |       react-jsx-dev-runtime.development.js
    |   |   |       react-jsx-dev-runtime.production.min.js
    |   |   |       react-jsx-dev-runtime.profiling.min.js
    |   |   |       react-jsx-runtime.development.js
    |   |   |       react-jsx-runtime.production.min.js
    |   |   |       react-jsx-runtime.profiling.min.js
    |   |   |       react.development.js
    |   |   |       react.production.min.js
    |   |   |       react.shared-subset.development.js
    |   |   |       react.shared-subset.production.min.js
    |   |   |       
    |   |   \---umd
    |   |           react.development.js
    |   |           react.production.min.js
    |   |           react.profiling.min.js
    |   |           
    |   +---react-dom
    |   |   |   client.js
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   profiling.js
    |   |   |   README.md
    |   |   |   server.browser.js
    |   |   |   server.js
    |   |   |   server.node.js
    |   |   |   test-utils.js
    |   |   |   
    |   |   +---cjs
    |   |   |       react-dom-server-legacy.browser.development.js
    |   |   |       react-dom-server-legacy.browser.production.min.js
    |   |   |       react-dom-server-legacy.node.development.js
    |   |   |       react-dom-server-legacy.node.production.min.js
    |   |   |       react-dom-server.browser.development.js
    |   |   |       react-dom-server.browser.production.min.js
    |   |   |       react-dom-server.node.development.js
    |   |   |       react-dom-server.node.production.min.js
    |   |   |       react-dom-test-utils.development.js
    |   |   |       react-dom-test-utils.production.min.js
    |   |   |       react-dom.development.js
    |   |   |       react-dom.production.min.js
    |   |   |       react-dom.profiling.min.js
    |   |   |       
    |   |   \---umd
    |   |           react-dom-server-legacy.browser.development.js
    |   |           react-dom-server-legacy.browser.production.min.js
    |   |           react-dom-server.browser.development.js
    |   |           react-dom-server.browser.production.min.js
    |   |           react-dom-test-utils.development.js
    |   |           react-dom-test-utils.production.min.js
    |   |           react-dom.development.js
    |   |           react-dom.production.min.js
    |   |           react-dom.profiling.min.js
    |   |           
    |   +---react-refresh
    |   |   |   babel.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   runtime.js
    |   |   |   
    |   |   \---cjs
    |   |           react-refresh-babel.development.js
    |   |           react-refresh-babel.production.js
    |   |           react-refresh-runtime.development.js
    |   |           react-refresh-runtime.production.js
    |   |           
    |   +---react-router
    |   |   |   CHANGELOG.md
    |   |   |   LICENSE.md
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   \---dist
    |   |       |   index.d.ts
    |   |       |   index.js
    |   |       |   index.js.map
    |   |       |   main.js
    |   |       |   react-router.development.js
    |   |       |   react-router.development.js.map
    |   |       |   react-router.production.min.js
    |   |       |   react-router.production.min.js.map
    |   |       |   
    |   |       +---lib
    |   |       |       components.d.ts
    |   |       |       context.d.ts
    |   |       |       deprecations.d.ts
    |   |       |       hooks.d.ts
    |   |       |       
    |   |       \---umd
    |   |               react-router.development.js
    |   |               react-router.development.js.map
    |   |               react-router.production.min.js
    |   |               react-router.production.min.js.map
    |   |               
    |   +---react-router-dom
    |   |   |   CHANGELOG.md
    |   |   |   LICENSE.md
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   server.d.ts
    |   |   |   server.js
    |   |   |   server.mjs
    |   |   |   
    |   |   \---dist
    |   |       |   dom.d.ts
    |   |       |   index.d.ts
    |   |       |   index.js
    |   |       |   index.js.map
    |   |       |   main.js
    |   |       |   react-router-dom.development.js
    |   |       |   react-router-dom.development.js.map
    |   |       |   react-router-dom.production.min.js
    |   |       |   react-router-dom.production.min.js.map
    |   |       |   server.d.ts
    |   |       |   server.js
    |   |       |   server.mjs
    |   |       |   
    |   |       \---umd
    |   |               react-router-dom.development.js
    |   |               react-router-dom.development.js.map
    |   |               react-router-dom.production.min.js
    |   |               react-router-dom.production.min.js.map
    |   |               
    |   +---rollup
    |   |   |   LICENSE.md
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   \---dist
    |   |       |   getLogFilter.d.ts
    |   |       |   getLogFilter.js
    |   |       |   loadConfigFile.d.ts
    |   |       |   loadConfigFile.js
    |   |       |   native.js
    |   |       |   parseAst.d.ts
    |   |       |   parseAst.js
    |   |       |   rollup.d.ts
    |   |       |   rollup.js
    |   |       |   
    |   |       +---bin
    |   |       |       rollup
    |   |       |       
    |   |       +---es
    |   |       |   |   getLogFilter.js
    |   |       |   |   package.json
    |   |       |   |   parseAst.js
    |   |       |   |   rollup.js
    |   |       |   |   
    |   |       |   \---shared
    |   |       |           node-entry.js
    |   |       |           parseAst.js
    |   |       |           watch.js
    |   |       |           
    |   |       \---shared
    |   |               fsevents-importer.js
    |   |               index.js
    |   |               loadConfigFile.js
    |   |               parseAst.js
    |   |               rollup.js
    |   |               watch-cli.js
    |   |               watch.js
    |   |               
    |   +---scheduler
    |   |   |   index.js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   unstable_mock.js
    |   |   |   unstable_post_task.js
    |   |   |   
    |   |   +---cjs
    |   |   |       scheduler-unstable_mock.development.js
    |   |   |       scheduler-unstable_mock.production.min.js
    |   |   |       scheduler-unstable_post_task.development.js
    |   |   |       scheduler-unstable_post_task.production.min.js
    |   |   |       scheduler.development.js
    |   |   |       scheduler.production.min.js
    |   |   |       
    |   |   \---umd
    |   |           scheduler-unstable_mock.development.js
    |   |           scheduler-unstable_mock.production.min.js
    |   |           scheduler.development.js
    |   |           scheduler.production.min.js
    |   |           scheduler.profiling.min.js
    |   |           
    |   +---semver
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   range.bnf
    |   |   |   README.md
    |   |   |   semver.js
    |   |   |   
    |   |   \---bin
    |   |           semver.js
    |   |           
    |   +---source-map-js
    |   |   |   LICENSE
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   source-map.d.ts
    |   |   |   source-map.js
    |   |   |   
    |   |   \---lib
    |   |           array-set.js
    |   |           base64-vlq.js
    |   |           base64.js
    |   |           binary-search.js
    |   |           mapping-list.js
    |   |           quick-sort.js
    |   |           source-map-consumer.d.ts
    |   |           source-map-consumer.js
    |   |           source-map-generator.d.ts
    |   |           source-map-generator.js
    |   |           source-node.d.ts
    |   |           source-node.js
    |   |           util.js
    |   |           
    |   +---update-browserslist-db
    |   |       check-npm-version.js
    |   |       cli.js
    |   |       index.d.ts
    |   |       index.js
    |   |       LICENSE
    |   |       package.json
    |   |       README.md
    |   |       utils.js
    |   |       
    |   +---vite
    |   |   |   client.d.ts
    |   |   |   index.cjs
    |   |   |   index.d.cts
    |   |   |   LICENSE.md
    |   |   |   package.json
    |   |   |   README.md
    |   |   |   
    |   |   +---bin
    |   |   |       openChrome.applescript
    |   |   |       vite.js
    |   |   |       
    |   |   +---dist
    |   |   |   +---client
    |   |   |   |       client.mjs
    |   |   |   |       env.mjs
    |   |   |   |       
    |   |   |   +---node
    |   |   |   |   |   cli.js
    |   |   |   |   |   constants.js
    |   |   |   |   |   index.d.ts
    |   |   |   |   |   index.js
    |   |   |   |   |   runtime.d.ts
    |   |   |   |   |   runtime.js
    |   |   |   |   |   types.d-aGj9QkWt.d.ts
    |   |   |   |   |   
    |   |   |   |   \---chunks
    |   |   |   |           dep-D-7KCb9p.js
    |   |   |   |           dep-D_zLpgQd.js
    |   |   |   |           dep-e9kYborm.js
    |   |   |   |           dep-IQS-Za7F.js
    |   |   |   |           dep-YkMKzX4u.js
    |   |   |   |           
    |   |   |   \---node-cjs
    |   |   |           publicUtils.cjs
    |   |   |           
    |   |   \---types
    |   |           customEvent.d.ts
    |   |           hmrPayload.d.ts
    |   |           hot.d.ts
    |   |           import-meta.d.ts
    |   |           importGlob.d.ts
    |   |           importMeta.d.ts
    |   |           metadata.d.ts
    |   |           package.json
    |   |           
    |   \---yallist
    |           iterator.js
    |           LICENSE
    |           package.json
    |           README.md
    |           yallist.js
    |           
    \---src
        |   App.jsx
        |   header.css
        |   layout-2col.css
        |   main.jsx
        |   nav.css
        |   projectview.css
        |   styles.css
        |   
        +---components
        |       SiteHeader.jsx
        |       TopNav.jsx
        |       
        \---pages
                Characters.jsx
                Dashboard.jsx
                ProjectLayout.jsx
                ProjectView.jsx
                World.jsx
                
```

## Dateien

### `.github\workflows\deploy.yml`
```yaml
name: Build & Deploy to App Runner

on:
  push:
    branches: [ master, main ]
  workflow_dispatch:

env:
  AWS_REGION: ${{ secrets.AWS_REGION }}
  ECR_REPOSITORY: ${{ secrets.ECR_REPOSITORY }}

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Show repo layout (sanity check)
        run: |
          pwd
          echo "Branch: $GITHUB_REF_NAME"
          ls -la
          echo "---- backend ----"
          ls -la backend || true
          echo "---- frontend ----"
          ls -la frontend || true
          test -f Dockerfile || (echo "Dockerfile fehlt im Repo-Root!" && exit 1)

      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Verify identity & basic permissions
        run: |
          set -euxo pipefail
          aws sts get-caller-identity
          aws ecr describe-registry

      - id: login-ecr
        name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Ensure ECR repository exists
        run: |
          aws ecr describe-repositories --repository-names "$ECR_REPOSITORY" \
          || aws ecr create-repository --repository-name "$ECR_REPOSITORY"

      - name: Build image
        env:
          REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          set -euxo pipefail
          IMAGE="$REGISTRY/$ECR_REPOSITORY"
          TAG="${GITHUB_SHA::7}"
          echo "Building $IMAGE:$TAG"
          docker build --progress=plain -t "$IMAGE:$TAG" -t "$IMAGE:latest" .

      - name: Push image
        env:
          REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          set -euxo pipefail
          IMAGE="$REGISTRY/$ECR_REPOSITORY"
          TAG="${GITHUB_SHA::7}"
          docker push "$IMAGE:$TAG"
          docker push "$IMAGE:latest"

      - name: Update App Runner to new image
        env:
          SERVICE_ARN: ${{ secrets.APP_RUNNER_SERVICE_ARN }}
          REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          set -euxo pipefail
          TAG="${GITHUB_SHA::7}"
          IMAGE_URI="$REGISTRY/$ECR_REPOSITORY:$TAG"
          echo "Updating $SERVICE_ARN to $IMAGE_URI"
          aws apprunner update-service \
            --service-arn "$SERVICE_ARN" \
            --source-configuration ImageRepository="{ImageIdentifier=\"$IMAGE_URI\",ImageRepositoryType=\"ECR\",ImageConfiguration={Port=\"8080\"}}"

```

### `.vs\VSWorkspaceState.json`
```json
{
  "ExpandedNodes": [
    "",
    "\\backend",
    "\\frontend",
    "\\frontend\\src"
  ],
  "SelectedNode": "\\frontend\\src\\main.jsx",
  "PreviewInSolutionExplorer": false
}
```

### `.vs\writehaven-clean-v2\v17\DocumentLayout.backup.json`
```json
{
  "Version": 1,
  "WorkspaceRootPath": "C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\",
  "Documents": [],
  "DocumentGroupContainers": [
    {
      "Orientation": 0,
      "VerticalTabListWidth": 256,
      "DocumentGroups": []
    }
  ]
}
```

### `.vs\writehaven-clean-v2\v17\DocumentLayout.json`
```json
{
  "Version": 1,
  "WorkspaceRootPath": "C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\",
  "Documents": [
    {
      "AbsoluteMoniker": "D:0:0:{A2FE74E1-B743-11D0-AE1A-00A0C90FFFC3}|\u003CMiscFiles\u003E|C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\frontend\\src\\main.jsx||{3B902123-F8A7-4915-9F01-361F908088D0}",
      "RelativeMoniker": "D:0:0:{A2FE74E1-B743-11D0-AE1A-00A0C90FFFC3}|\u003CMiscFiles\u003E|solutionrelative:frontend\\src\\main.jsx||{3B902123-F8A7-4915-9F01-361F908088D0}"
    },
    {
      "AbsoluteMoniker": "D:0:0:{A2FE74E1-B743-11D0-AE1A-00A0C90FFFC3}|\u003CMiscFiles\u003E|C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\frontend\\vite.config.js||{3B902123-F8A7-4915-9F01-361F908088D0}",
      "RelativeMoniker": "D:0:0:{A2FE74E1-B743-11D0-AE1A-00A0C90FFFC3}|\u003CMiscFiles\u003E|solutionrelative:frontend\\vite.config.js||{3B902123-F8A7-4915-9F01-361F908088D0}"
    },
    {
      "AbsoluteMoniker": "D:0:0:{A2FE74E1-B743-11D0-AE1A-00A0C90FFFC3}|\u003CMiscFiles\u003E|C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\backend\\wsgi.py||{8B382828-6202-11D1-8870-0000F87579D2}",
      "RelativeMoniker": "D:0:0:{A2FE74E1-B743-11D0-AE1A-00A0C90FFFC3}|\u003CMiscFiles\u003E|solutionrelative:backend\\wsgi.py||{8B382828-6202-11D1-8870-0000F87579D2}"
    },
    {
      "AbsoluteMoniker": "D:0:0:{A2FE74E1-B743-11D0-AE1A-00A0C90FFFC3}|\u003CMiscFiles\u003E|C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\backend\\models.py||{8B382828-6202-11D1-8870-0000F87579D2}",
      "RelativeMoniker": "D:0:0:{A2FE74E1-B743-11D0-AE1A-00A0C90FFFC3}|\u003CMiscFiles\u003E|solutionrelative:backend\\models.py||{8B382828-6202-11D1-8870-0000F87579D2}"
    }
  ],
  "DocumentGroupContainers": [
    {
      "Orientation": 0,
      "VerticalTabListWidth": 256,
      "DocumentGroups": [
        {
          "DockedWidth": 200,
          "SelectedChildIndex": 0,
          "Children": [
            {
              "$type": "Document",
              "DocumentIndex": 0,
              "Title": "main.jsx",
              "DocumentMoniker": "C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\frontend\\src\\main.jsx",
              "RelativeDocumentMoniker": "frontend\\src\\main.jsx",
              "ToolTip": "C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\frontend\\src\\main.jsx",
              "RelativeToolTip": "frontend\\src\\main.jsx",
              "ViewState": "AgIAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAA==",
              "Icon": "ae27a6b0-e345-4288-96df-5eaf394ee369.003663|",
              "WhenOpened": "2025-10-08T21:47:23.748Z",
              "EditorCaption": ""
            },
            {
              "$type": "Document",
              "DocumentIndex": 1,
              "Title": "vite.config.js",
              "DocumentMoniker": "C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\frontend\\vite.config.js",
              "RelativeDocumentMoniker": "frontend\\vite.config.js",
              "ToolTip": "C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\frontend\\vite.config.js",
              "RelativeToolTip": "frontend\\vite.config.js",
              "ViewState": "AgIAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAA==",
              "Icon": "ae27a6b0-e345-4288-96df-5eaf394ee369.001646|",
              "WhenOpened": "2025-10-08T20:53:32.853Z",
              "EditorCaption": ""
            },
            {
              "$type": "Document",
              "DocumentIndex": 3,
              "Title": "models.py",
              "DocumentMoniker": "C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\backend\\models.py",
              "RelativeDocumentMoniker": "backend\\models.py",
              "ToolTip": "C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\backend\\models.py",
              "RelativeToolTip": "backend\\models.py",
              "ViewState": "AgIAAAAAAAAAAAAAAAAAABsAAAAlAAAAAAAAAA==",
              "Icon": "00000000-0000-0000-0000-000000000000.000000|iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHfSURBVDhPpZCxaxNhGMZ/9zVJaUuDUlq1FBWLZBFTCXo4BFyU1qGKi4OkIHhkzF/g0KF00M2lR9YUdDDQQVAcJILoQUd1UNRmkhoRm8RL777v7nOoCZd4AcEH3uF5nvd73vd74X\u002BgtTai3LIsHeWDEEJct217a1DvwbIs7bpubFUqFW3b9naxWLwWfSOipAvHcfqqi0KhkMtms3cty1rsaomeG4FpmoMSANVqlXQ6nQMWgacMC4hOBchduEj\u002ByjKjScGh8SS1Wq3nxQZEN3j1eY/Vrfe8rTeQvsf89ARLS1cz5XIZ/uUGXxptQiVRUhJIybudXaZn52a7vbEBpmkyNb/A69YM9W8tDEJOTI2hpI\u002BSkvOZH2f13sNAB\u002B07sV9wHIdH9Unquz9RvoeUPtL3UFISKkky\u002BAT7HwTi6FpsgGma3N9\u002Bg5I\u002BKaFZyU8wOpJChwHnjiuE9wKCXyC/zsQGOI7DeELjtiUPbgky6Wd/HA3KBelC4AIpNfQGl88cQ0mfI5PugRhKkM2DUk0INYwtPI/dAGAlf4rbl06T6DyBVgeCABJzYPhwcm0V8ICNvwJKpVIf37h3IxSyKVAuBMDIYQAMw1jvaxwGrYNl3Xq5o79vat3Y3Nedj4\u002B11je7/m\u002BXOuyzFtDhUgAAAABJRU5ErkJggg==",
              "WhenOpened": "2025-10-08T20:42:32.104Z",
              "EditorCaption": ""
            },
            {
              "$type": "Document",
              "DocumentIndex": 2,
              "Title": "wsgi.py",
              "DocumentMoniker": "C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\backend\\wsgi.py",
              "RelativeDocumentMoniker": "backend\\wsgi.py",
              "ToolTip": "C:\\Users\\anton\\source\\repos\\writehaven-clean-v2\\backend\\wsgi.py",
              "RelativeToolTip": "backend\\wsgi.py",
              "ViewState": "AgIAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAA==",
              "Icon": "00000000-0000-0000-0000-000000000000.000000|iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHfSURBVDhPpZCxaxNhGMZ/9zVJaUuDUlq1FBWLZBFTCXo4BFyU1qGKi4OkIHhkzF/g0KF00M2lR9YUdDDQQVAcJILoQUd1UNRmkhoRm8RL777v7nOoCZd4AcEH3uF5nvd73vd74X\u002BgtTai3LIsHeWDEEJct217a1DvwbIs7bpubFUqFW3b9naxWLwWfSOipAvHcfqqi0KhkMtms3cty1rsaomeG4FpmoMSANVqlXQ6nQMWgacMC4hOBchduEj\u002ByjKjScGh8SS1Wq3nxQZEN3j1eY/Vrfe8rTeQvsf89ARLS1cz5XIZ/uUGXxptQiVRUhJIybudXaZn52a7vbEBpmkyNb/A69YM9W8tDEJOTI2hpI\u002BSkvOZH2f13sNAB\u002B07sV9wHIdH9Unquz9RvoeUPtL3UFISKkky\u002BAT7HwTi6FpsgGma3N9\u002Bg5I\u002BKaFZyU8wOpJChwHnjiuE9wKCXyC/zsQGOI7DeELjtiUPbgky6Wd/HA3KBelC4AIpNfQGl88cQ0mfI5PugRhKkM2DUk0INYwtPI/dAGAlf4rbl06T6DyBVgeCABJzYPhwcm0V8ICNvwJKpVIf37h3IxSyKVAuBMDIYQAMw1jvaxwGrYNl3Xq5o79vat3Y3Nedj4\u002B11je7/m\u002BXOuyzFtDhUgAAAABJRU5ErkJggg==",
              "WhenOpened": "2025-10-08T20:40:02.371Z",
              "EditorCaption": ""
            }
          ]
        }
      ]
    }
  ]
}
```

### `backend\__init__.py`
```python
from .app import create_app

```

### `backend\app.py`
```python
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

# Flexible Imports (lokal vs. Paket)
try:
    from backend.extensions import db
    from backend.models import Project, Chapter, Scene, Character, WorldNode
except ImportError:
    from extensions import db
    from models import Project, Chapter, Scene, Character, WorldNode


# -------------------- DB Helpers --------------------
def make_sqlite_uri() -> str:
    # Fallback: /tmp ist in App Runner beschreibbar
    path = os.getenv("SQLITE_PATH", "/tmp/app.db")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return "sqlite:///" + path.replace("\\", "/")


def get_database_uri() -> str:
    uri = os.getenv("DATABASE_URL")
    # Heroku-style: postgres:// -> psycopg v3 URL
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql+psycopg://", 1)
    return uri or make_sqlite_uri()


# -------------------- App Factory --------------------
def create_app():
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.sort_keys = False

    # SQLAlchemy
    app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,
        "pool_recycle": 1800,
    }

    # CORS
    allowed = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]
    CORS(
        app,
        resources={r"/api/*": {"origins": allowed}},
        supports_credentials=False,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # DB init
    db.init_app(app)

    with app.app_context():
        # SQLite: Foreign Keys aktivieren
        if app.config["SQLALCHEMY_DATABASE_URI"].startswith("sqlite"):
            from sqlalchemy import event
            from sqlalchemy.engine import Engine

            @event.listens_for(Engine, "connect")
            def _set_sqlite_pragma(dbapi_connection, connection_record):
                cur = dbapi_connection.cursor()
                cur.execute("PRAGMA foreign_keys=ON")
                cur.close()

        # Robust starten: DB-Fehler nicht crashen lassen
        try:
            db.create_all()
        except Exception:
            app.logger.exception("DB init failed; service continues without DB")

    # --------------- Small helpers ---------------
    def ok(data, status=200):
        return jsonify(data), status

    def not_found():
        return ok({"error": "not_found"}, 404)

    def bad_request(msg="bad_request"):
        return ok({"error": msg}, 400)

    # -------------------- Health (für App Runner) --------------------
    @app.get("/api/health")
    def health():
        try:
            db.session.execute(text("SELECT 1"))
            db_ok = "ok"
        except Exception as e:
            # Wichtig: HTTP 200 beibehalten; Status im Body signalisieren
            db_ok = f"error: {e.__class__.__name__}: {e}"
        return jsonify({"status": "ok", "db": db_ok}), 200

    # -------------------- Projects --------------------
    @app.get("/api/projects")
    def list_projects():
        rows = (
            Project.query.order_by(Project.updated_at.desc()).all()
            if hasattr(Project, "updated_at")
            else Project.query.order_by(Project.id.desc()).all()
        )
        return ok(
            [{"id": p.id, "title": p.title, "description": p.description} for p in rows]
        )

    @app.post("/api/projects")
    def create_project():
        data = request.get_json() or {}
        p = Project(
            title=data.get("title") or "Neues Projekt",
            description=data.get("description", ""),
        )
        db.session.add(p)
        db.session.commit()
        return ok({"id": p.id, "title": p.title, "description": p.description}, 201)

    @app.get("/api/projects/<int:pid>")
    def get_project(pid):
        p = Project.query.get(pid)
        if not p:
            return not_found()
        return ok({"id": p.id, "title": p.title, "description": p.description})

    @app.put("/api/projects/<int:pid>")
    def update_project(pid):
        p = Project.query.get(pid)
        if not p:
            return not_found()
        data = request.get_json() or {}
        p.title = data.get("title", p.title)
        p.description = data.get("description", p.description)
        db.session.commit()
        return ok({"id": p.id, "title": p.title, "description": p.description})

    @app.delete("/api/projects/<int:pid>")
    def delete_project(pid):
        p = Project.query.get(pid)
        if not p:
            return not_found()
        db.session.delete(p)
        db.session.commit()
        return ok({"ok": True})

    # -------------------- Chapters --------------------
    @app.get("/api/projects/<int:pid>/chapters")
    def list_chapters(pid):
        rows = (
            Chapter.query.filter_by(project_id=pid)
            .order_by(Chapter.order_index.asc(), Chapter.id.asc())
            .all()
        )
        return ok(
            [
                {
                    "id": c.id,
                    "project_id": c.project_id,
                    "title": c.title,
                    "order_index": c.order_index,
                    "content": getattr(c, "content", None),
                }
                for c in rows
            ]
        )

    @app.post("/api/projects/<int:pid>/chapters")
    def create_chapter(pid):
        proj = Project.query.get(pid)
        if not proj:
            return not_found()
        data = request.get_json() or {}
        title = (data.get("title") or "Neues Kapitel").strip()
        order_index = int(data.get("order_index", 0))
        c = Chapter(project_id=pid, title=title, order_index=order_index)
        db.session.add(c)
        db.session.commit()
        return ok(
            {
                "id": c.id,
                "title": c.title,
                "order_index": c.order_index,
                "project_id": c.project_id,
            },
            201,
        )

    @app.get("/api/chapters/<int:cid>")
    def get_chapter(cid):
        c = Chapter.query.get(cid)
        if not c:
            return not_found()
        return ok(
            {
                "id": c.id,
                "project_id": c.project_id,
                "title": c.title,
                "order_index": c.order_index,
                "content": getattr(c, "content", None),
            }
        )

    @app.put("/api/chapters/<int:cid>")
    def update_chapter(cid):
        c = Chapter.query.get(cid)
        if not c:
            return not_found()
        data = request.get_json() or {}
        title = data.get("title")
        if title is not None:
            c.title = title.strip()
        if "order_index" in data:
            c.order_index = int(data.get("order_index") or 0)
        db.session.commit()
        return ok(
            {
                "id": c.id,
                "title": c.title,
                "order_index": c.order_index,
                "project_id": c.project_id,
            }
        )

    @app.delete("/api/chapters/<int:cid>")
    def delete_chapter(cid):
        c = Chapter.query.get(cid)
        if not c:
            return not_found()
        db.session.delete(c)
        db.session.commit()
        return ok({"ok": True})

    # -------------------- Scenes --------------------
    @app.get("/api/chapters/<int:cid>/scenes")
    def list_scenes(cid):
        rows = (
            Scene.query.filter_by(chapter_id=cid)
            .order_by(Scene.order_index.asc(), Scene.id.asc())
            .all()
        )
        return ok(
            [
                {
                    "id": s.id,
                    "chapter_id": s.chapter_id,
                    "title": s.title,
                    "order_index": s.order_index,
                    "content": s.content,
                }
                for s in rows
            ]
        )

    @app.post("/api/chapters/<int:cid>/scenes")
    def create_scene(cid):
        chap = Chapter.query.get(cid)
        if not chap:
            return not_found()
        data = request.get_json() or {}
        title = (data.get("title") or "Neue Szene").strip()
        order_index = int(data.get("order_index", 0))
        content = data.get("content", "") or ""
        s = Scene(
            chapter_id=cid, title=title, order_index=order_index, content=content
        )
        try:
            db.session.add(s)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return bad_request("Database integrity error while creating scene.")
        return ok(
            {
                "id": s.id,
                "title": s.title,
                "order_index": s.order_index,
                "chapter_id": s.chapter_id,
                "content": s.content,
            },
            201,
        )

    @app.get("/api/scenes/<int:sid>")
    def get_scene(sid):
        s = Scene.query.get(sid)
        if not s:
            return not_found()
        return ok(
            {
                "id": s.id,
                "chapter_id": s.chapter_id,
                "title": s.title,
                "order_index": s.order_index,
                "content": s.content,
            }
        )

    @app.put("/api/scenes/<int:sid>")
    def update_scene(sid):
        s = Scene.query.get(sid)
        if not s:
            return not_found()
        data = request.get_json() or {}
        title = data.get("title")
        content = data.get("content")
        if title is not None:
            s.title = title.strip()
        if content is not None:
            s.content = content
        db.session.commit()
        return ok(
            {
                "id": s.id,
                "title": s.title,
                "order_index": s.order_index,
                "chapter_id": s.chapter_id,
                "content": s.content,
            }
        )

    @app.delete("/api/scenes/<int:sid>")
    def delete_scene(sid):
        s = Scene.query.get(sid)
        if not s:
            return not_found()
        db.session.delete(s)
        db.session.commit()
        return ok({"ok": True})

    # -------------------- Characters --------------------
    @app.get("/api/projects/<int:pid>/characters")
    def list_characters(pid):
        rows = Character.query.filter_by(project_id=pid).order_by(
            Character.id.asc()
        ).all()
        return ok(
            [
                {
                    "id": c.id,
                    "project_id": c.project_id,
                    "name": c.name,
                    "summary": c.summary,
                    "avatar_url": c.avatar_url,
                }
                for c in rows
            ]
        )

    @app.post("/api/projects/<int:pid>/characters")
    def create_character(pid):
        data = request.get_json() or {}
        c = Character(
            project_id=pid,
            name=data.get("name") or "Neue Figur",
            summary=data.get("summary", ""),
            avatar_url=data.get("avatar_url", ""),
        )
        db.session.add(c)
        db.session.commit()
        return ok(
            {
                "id": c.id,
                "project_id": c.project_id,
                "name": c.name,
                "summary": c.summary,
                "avatar_url": c.avatar_url,
            },
            201,
        )

    @app.get("/api/characters/<int:cid>")
    def get_character(cid):
        c = Character.query.get(cid)
        if not c:
            return not_found()
        return ok(
            {
                "id": c.id,
                "project_id": c.project_id,
                "name": c.name,
                "summary": c.summary,
                "avatar_url": c.avatar_url,
            }
        )

    @app.put("/api/characters/<int:cid>")
    def update_character(cid):
        c = Character.query.get(cid)
        if not c:
            return not_found()
        data = request.get_json() or {}
        c.name = data.get("name", c.name)
        c.summary = data.get("summary", c.summary)
        c.avatar_url = data.get("avatar_url", c.avatar_url)
        db.session.commit()
        return ok(
            {
                "id": c.id,
                "project_id": c.project_id,
                "name": c.name,
                "summary": c.summary,
                "avatar_url": c.avatar_url,
            }
        )

    @app.delete("/api/characters/<int:cid>")
    def delete_character(cid):
        c = Character.query.get(cid)
        if not c:
            return not_found()
        db.session.delete(c)
        db.session.commit()
        return ok({"ok": True})

    # -------------------- World --------------------
    @app.get("/api/projects/<int:pid>/world")
    def list_world(pid):
        rows = WorldNode.query.filter_by(project_id=pid).order_by(
            WorldNode.id.asc()
        ).all()
        return ok(
            [
                {
                    "id": w.id,
                    "project_id": w.project_id,
                    "title": w.title,
                    "kind": w.kind,
                    "summary": w.summary,
                    "icon": w.icon,
                }
                for w in rows
            ]
        )

    @app.post("/api/projects/<int:pid>/world")
    def create_world(pid):
        data = request.get_json() or {}
        wnode = WorldNode(
            project_id=pid,
            title=data.get("title") or "Neues Element",
            kind=data.get("kind", "Ort"),
            summary=data.get("summary", ""),
            icon=data.get("icon", "🏰"),
        )
        db.session.add(wnode)
        db.session.commit()
        return ok(
            {
                "id": wnode.id,
                "project_id": wnode.project_id,
                "title": wnode.title,
                "kind": wnode.kind,
                "summary": wnode.summary,
                "icon": wnode.icon,
            },
            201,
        )

    @app.put("/api/world/<int:w_id>")
    def update_world(w_id):
        wnode = WorldNode.query.get(w_id)
        if not wnode:
            return not_found()
        data = request.get_json() or {}
        wnode.title = data.get("title", wnode.title)
        wnode.kind = data.get("kind", wnode.kind)
        wnode.summary = data.get("summary", wnode.summary)
        wnode.icon = data.get("icon", wnode.icon)
        db.session.commit()
        return ok(
            {
                "id": wnode.id,
                "project_id": wnode.project_id,
                "title": wnode.title,
                "kind": wnode.kind,
                "summary": wnode.summary,
                "icon": wnode.icon,
            }
        )

    @app.delete("/api/world/<int:w_id>")
    def delete_world(w_id):
        wnode = WorldNode.query.get(w_id)
        if not wnode:
            return not_found()
        db.session.delete(wnode)
        db.session.commit()
        return ok({"ok": True})

    # (Optional) globaler Integrity-Handler
    @app.errorhandler(IntegrityError)
    def handle_integrity(e):
        db.session.rollback()
        return bad_request("Database integrity error.")

    # ---- SPA-Fallback: liefert index.html / Assets; NICHT für /api/... ----
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def spa(path):
        # API nicht intercepten
        if path.startswith("api/"):
            return not_found()
        # vorhandene Datei direkt liefern
        file_path = os.path.join(app.static_folder, path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return app.send_static_file(path)
        # ansonsten immer index.html (Client Routing)
        return app.send_static_file("index.html")

    return app


# Lokaler Start: python app.py
if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)

```

### `backend\extensions.py`
```python
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

```

### `backend\models.py`
```python
from sqlalchemy import func
# backend/models.py
try:
    from backend.extensions import db   # wenn als Paket gestartet (python -m backend.app)
except ImportError:
    from extensions import db           # wenn im Container aus /app gestartet

class Project(db.Model):
    __tablename__ = "project"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, default="Neues Projekt")
    description = db.Column(db.Text, default="")
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())

    chapters = db.relationship("Chapter", cascade="all, delete-orphan", backref="project", lazy="selectin")
    characters = db.relationship("Character", cascade="all, delete-orphan", backref="project", lazy="selectin")
    worldnodes = db.relationship("WorldNode", cascade="all, delete-orphan", backref="project", lazy="selectin")

class Chapter(db.Model):
    __tablename__ = "chapter"
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False, default="Neues Kapitel")
    order_index = db.Column(db.Integer, nullable=False, default=0)
    content = db.Column(db.Text, default="")
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())

    scenes = db.relationship("Scene", cascade="all, delete-orphan", backref="chapter", lazy="selectin")

class Scene(db.Model):
    __tablename__ = "scene"
    id = db.Column(db.Integer, primary_key=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey("chapter.id"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False, default="Neue Szene")
    content = db.Column(db.Text, default="")
    order_index = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())

class Character(db.Model):
    __tablename__ = "character"
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False, index=True)
    name = db.Column(db.String(200), nullable=False)
    summary = db.Column(db.Text, default="")
    avatar_url = db.Column(db.String(500), default="")

class WorldNode(db.Model):
    __tablename__ = "worldnode"
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    kind = db.Column(db.String(100), nullable=False, default="Ort")
    summary = db.Column(db.Text, default="")
    icon = db.Column(db.String(50), default="🏰")

```

### `backend\requirements.txt`
```text
Flask==3.0.0
Flask-Cors==4.0.0
Flask-SQLAlchemy==3.1.1
SQLAlchemy==2.0.32
psycopg[binary]==3.1.19  # Postgres client v3 as binary
gunicorn==21.2.0

```

### `backend\wsgi.py`
```python
# backend/wsgi.py
try:
    from backend.app import create_app   # Paket-Start
except ImportError:
    from app import create_app           # Container-Start (WORKDIR=/app)

app = create_app()

```

### `frontend\index.html`
```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Writehaven</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

### `frontend\package.json`
```json
{
  "name": "writehaven-clean-v2",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.7"
  }
}

```

### `frontend\src\App.jsx`
```jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'

export default function App() {
  return (
    <div className="app-root">
      <SiteHeader />
      <Outlet />
    </div>
  )
}

```

### `frontend\src\components\SiteHeader.jsx`
```jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="Writehaven Home">
        <span className="brand-icon" aria-hidden="true">
          {/* kleines Feder-Icon (inline SVG), ersetzbar durch <img src="/logo.svg" /> */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 4a1 1 0 0 0-1.41 0l-2.34 2.34 2.41 2.41L22 6.41A1 1 0 0 0 21 4zM15.85 6.56l-9.7 9.7a2 2 0 0 0-.5.86l-1 3.07a.75.75 0 0 0 .94.94l3.07-1c.33-.11.63-.3.86-.53l9.7-9.7-2.37-2.34z"></path>
          </svg>
        </span>
        <span className="brand-name">Writehaven</span>
      </Link>

      <div className="header-actions">
        {/* Platz f�r Buttons (Profil, Settings, etc.) */}
      </div>
    </header>
  )
}

```

### `frontend\src\components\TopNav.jsx`
```jsx
import React from 'react'
import { NavLink, useParams } from 'react-router-dom'

export default function TopNav(){
  const { id } = useParams()
  if (!id) return null            // nur auf Projektseiten anzeigen
  const base = `/project/${id}`
  return (
    <div className="tabs">
      <NavLink end to={base} className="tab">Schreiben</NavLink>
      <NavLink to={`${base}/characters`} className="tab">Charaktere</NavLink>
      <NavLink to={`${base}/world`} className="tab">Welt</NavLink>
      <NavLink to={`${base}/preview`} className="tab">Vorschau</NavLink>
    </div>
  )
}

```

### `frontend\src\header.css`
```css
:root{ --header-h: 56px; }

.site-header{
  position: sticky;
  top: 0;
  z-index: 50;
  min-height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  padding: .6rem .9rem;
}

.brand{
  display:flex; align-items:center; gap:.55rem;
  font-weight:700; color: var(--text); text-decoration:none;
}
.brand-icon{
  display:inline-flex; width:28px; height:28px;
  background:#0f1823; border:1px solid var(--border);
  border-radius:8px; align-items:center; justify-content:center;
}
.brand-name{ letter-spacing:.2px; }

.header-actions .btn{ margin-left:.4rem; }

```

### `frontend\src\layout-2col.css`
```css
.page-wrap{
  position: relative;              /* gegen �berlappende Kinder */
  display:grid;
  grid-template-columns: 280px 1fr;
  gap: 1rem;
  padding: .9rem;
  height: 100%;
}

.side{
  position: relative;              /* klar definierte Ebene */
  z-index: 2;                      /* �ber dem Main-Panel */
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: .8rem;
  overflow:auto;
}

.main{
  position: relative;
  z-index: 1;
  display:flex;
  flex-direction:column;
  gap:1rem;
  min-width:0;
}

.panel{
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: .9rem;
}

@media (max-width: 900px){
  .page-wrap{ grid-template-columns: 1fr; }
}

```

### `frontend\src\main.jsx`
```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProjectLayout from './pages/ProjectLayout.jsx'   // <� neu
import ProjectView from './pages/ProjectView.jsx'
import Characters from './pages/Characters.jsx'         // <� neu
import World from './pages/World.jsx'                   // <� neu

import './styles.css'
import './layout-2col.css'
import './projectview.css'
import './nav.css'                                      // <� neu

import axios from 'axios'

// (dein Interceptor bleibt gleich)
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
function joinUrl(base, path){ if(!base) return path; const p=('/'+String(path||'')).replace(/\/{2,}/g,'/'); return base+p }
axios.interceptors.request.use(cfg=>{
  const url = cfg.url || ''
  if(/^https?:\/\//i.test(url)) return cfg
  const startsWithApi = url.startsWith('/api') || url.startsWith('api')
  if(API_BASE && startsWithApi){ cfg.url = joinUrl(API_BASE, url.replace(/^\/?api/, '/api')) }
  return cfg
})

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          {/* Projekt-Layout mit Tabs + Unterseiten */}
          <Route path="project/:id" element={<ProjectLayout />}>
            <Route index element={<ProjectView />} />        {/* Schreiben */}
            <Route path="characters" element={<Characters />} />
            <Route path="world" element={<World />} />
            {/* <Route path="preview" element={<Preview />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

```

### `frontend\src\nav.css`
```css
:root{ --header-h: 56px; }

.tabs{
  display:flex; gap:.4rem;
  background: var(--bg-2);
  border:1px solid var(--border);
  border-radius: 14px;
  padding:.45rem;
  margin:.75rem .9rem 0 .9rem;
  position: sticky;
  top: var(--header-h);        /* sitzt direkt unter dem Header */
  z-index: 40;
}
.tab{
  display:inline-flex; align-items:center;
  padding:.5rem .8rem; border-radius:10px;
  border:1px solid var(--border);
  background:#0c1219; color:inherit; text-decoration:none;
}
.tab:hover{ border-color:#2a3848; }
.tab.active, .tab[aria-current="page"]{
  background:#0f1823; border-color:var(--primary);
  box-shadow: 0 0 0 2px rgba(78,161,255,.15) inset;
}

```

### `frontend\src\pages\Characters.jsx`
```jsx
import React from 'react'

export default function Characters(){
  // Du kannst hier sp�ter deine Character-Logik/Listen einbauen
  return (
    <div className="page-wrap">
      <aside className="side">
        <div className="side-group">
          <div className="side-head">Charaktere</div>
          <button className="btn small">+ Charakter</button>
          <div className="side-list">
            {/* Charakterliste */}
          </div>
        </div>
      </aside>
      <main className="main">
        <div className="panel">
          <h3>Charakter-Details</h3>
          <p className="empty">W�hle links einen Charakter oder lege einen neuen an.</p>
        </div>
      </main>
    </div>
  )
}

```

### `frontend\src\pages\Dashboard.jsx`
```jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Dashboard(){
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(){
    try {
      const r = await axios.get('/api/projects')
      setProjects(r.data || [])
    } catch (err) {
      console.error('Load /api/projects failed', err)
      alert('Konnte Projekte nicht laden. Läuft das Backend?')
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=>{ load() }, [])

  async function addProject(){
    if(!title.trim()) return
    try {
      const r = await axios.post('/api/projects', { title })
      setProjects([r.data, ...projects]); setTitle('')
    } catch (err) {
      console.error('Create project failed', err)
      alert('Projekt konnte nicht angelegt werden.')
    }
  }

  async function renameProject(p){
    try {
      const nt = prompt('Neuer Projektname', p.title) || p.title
      const r = await axios.put(`/api/projects/${p.id}`, { title: nt })
      setProjects(projects.map(x => x.id===p.id ? r.data : x))
    } catch (err) {
      console.error('Rename project failed', err)
      alert('Umbenennen fehlgeschlagen.')
    }
  }

  async function removeProject(p){
    try {
      if(!confirm('Projekt wirklich löschen?')) return
      await axios.delete(`/api/projects/${p.id}`)
      setProjects(projects.filter(x => x.id!==p.id))
    } catch (err) {
      console.error('Delete project failed', err)
      alert('Löschen fehlgeschlagen.')
    }
  }

  return (
    <div>
      <h1>Deine Projekte</h1>
      <div className="row">
        <input placeholder="Neues Projekt" value={title} onChange={e=>setTitle(e.target.value)} />
        <button onClick={addProject}>Anlegen</button>
      </div>

      {loading ? (
        <div style={{opacity:.7, marginTop: 16}}>Lade…</div>
      ) : (
        <div className="grid">
          {projects.map(p => (
            <div key={p.id} className="card">
              <div className="card-title">{p.title}</div>
              <div className="card-actions">
                <Link className="btn" to={`/project/${p.id}`}>Öffnen</Link>
                <button className="btn" onClick={()=>renameProject(p)}>Umbenennen</button>
                <button className="btn danger" onClick={()=>removeProject(p)}>Löschen</button>
              </div>
            </div>
          ))}
          {!projects.length && <div className="empty">Noch keine Projekte – lege oben ein neues an.</div>}
        </div>
      )}
    </div>
  )
}

```

### `frontend\src\pages\ProjectLayout.jsx`
```jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav.jsx'

function ProjectLayout() {
  return (
    <>
      <TopNav />
      <Outlet />
    </>
  )
}

// Default-Export (wichtig f�r: import ProjectLayout from '...'):
export default ProjectLayout
// Optional zus�tzlich als Named-Export:
export { ProjectLayout }

```

### `frontend\src\pages\ProjectView.jsx`
```jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function ProjectView() {
  const { id } = useParams()
  const pid = Number(id)

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [chapters, setChapters] = useState([])
  const [scenesByChapter, setScenesByChapter] = useState({})

  const [activeChapterId, setActiveChapterId] = useState(null)
  const [activeSceneId, setActiveSceneId] = useState(null)

  const [sceneTitle, setSceneTitle] = useState('')
  const [sceneContent, setSceneContent] = useState('')

  useEffect(() => {
    let cancel = false
    async function loadAll() {
      setLoading(true)
      try {
        const [p, ch] = await Promise.all([
          axios.get(`/api/projects/${pid}`),
          axios.get(`/api/projects/${pid}/chapters`)
        ])
        if (cancel) return

        setProject(p.data)
        setChapters(ch.data || [])

        if ((ch.data || []).length) {
          const chapterId = ch.data[0].id
          setActiveChapterId(chapterId)
          const r = await axios.get(`/api/chapters/${chapterId}/scenes`)
          if (cancel) return
          setScenesByChapter(prev => ({ ...prev, [chapterId]: r.data || [] }))

          if ((r.data || []).length) {
            const s = r.data[0]
            setActiveSceneId(s.id)
            setSceneTitle(s.title || '')
            setSceneContent(s.content || '')
          }
        }
      } catch (err) {
        if (err?.response?.status === 404) {
          alert('Projekt nicht gefunden. Bitte zuerst ein Projekt anlegen.')
        } else {
          console.error('Load failed', err)
          alert('Laden fehlgeschlagen. Bitte später erneut versuchen.')
        }
      } finally {
        if (!cancel) setLoading(false)
      }
    }
    loadAll()
    return () => { cancel = true }
  }, [pid])

  useEffect(() => {
    if (!activeSceneId) return
    const t = setTimeout(async () => {
      try {
        await axios.put(`/api/scenes/${activeSceneId}`, {
          title: sceneTitle,
          content: sceneContent
        })
      } catch (err) {
        console.warn('Autosave failed', err)
      }
    }, 600)
    return () => clearTimeout(t)
  }, [activeSceneId, sceneTitle, sceneContent])

  async function addChapter() {
    try {
      const r = await axios.post(`/api/projects/${pid}/chapters`, {
        title: `Kapitel ${chapters.length + 1}`,
        order_index: chapters.length
      })
      const newChapters = [...chapters, r.data]
      setChapters(newChapters)
      setActiveChapterId(r.data.id)
      setScenesByChapter(prev => ({ ...prev, [r.data.id]: [] }))
      setActiveSceneId(null)
      setSceneTitle('')
      setSceneContent('')
    } catch (err) {
      console.error(err)
      alert('Kapitel konnte nicht angelegt werden.')
    }
  }

  async function addScene() {
    if (!activeChapterId) return
    const cur = scenesByChapter[activeChapterId] || []
    try {
      const r = await axios.post(`/api/chapters/${activeChapterId}/scenes`, {
        title: `Szene ${cur.length + 1}`,
        order_index: cur.length
      })
      const updated = { ...scenesByChapter, [activeChapterId]: [...cur, r.data] }
      setScenesByChapter(updated)
      setActiveSceneId(r.data.id)
      setSceneTitle(r.data.title || '')
      setSceneContent(r.data.content || '')
    } catch (err) {
      if (err?.response?.status === 404) {
        alert('Kapitel existiert nicht (mehr). Bitte Seite neu laden.')
      } else {
        console.error(err)
        alert('Szene konnte nicht angelegt werden.')
      }
    }
  }

  async function loadScenesForChapter(chapterId) {
    try {
      const r = await axios.get(`/api/chapters/${chapterId}/scenes`)
      setScenesByChapter(prev => ({ ...prev, [chapterId]: r.data || [] }))
      if ((r.data || []).length) {
        const s = r.data[0]
        setActiveSceneId(s.id)
        setSceneTitle(s.title || '')
        setSceneContent(s.content || '')
      } else {
        setActiveSceneId(null)
        setSceneTitle('')
        setSceneContent('')
      }
    } catch (err) {
      console.error(err)
      alert('Szenen konnten nicht geladen werden.')
    }
  }

  function onSelectChapter(chapterId) {
    setActiveChapterId(chapterId)
    // Szenen immer nachladen, damit Content aktuell ist
    loadScenesForChapter(chapterId)
  }

  function onSelectScene(scene) {
    setActiveSceneId(scene.id)
    setSceneTitle(scene.title || '')
    setSceneContent(scene.content || '')
  }

  if (loading) {
    return <div className="page-wrap"><div className="panel"><h3>Lade…</h3></div></div>
  }

  return (
    <div className="page-wrap">
      <aside className="side">
        <div className="side-group">
          <div className="side-head">Kapitel</div>
          <button className="btn small" onClick={addChapter}>+ Kapitel</button>
          <div className="side-list">
            {chapters.map(ch => (
              <button
                key={ch.id}
                type="button"
                className={`side-item-btn ${activeChapterId === ch.id ? 'active' : ''}`}
                onClick={() => onSelectChapter(ch.id)}
              >
                {ch.title}
              </button>
            ))}
          </div>
        </div>

        <div className="side-group">
          <div className="side-head">Szenen</div>
          <button className="btn small" onClick={addScene} disabled={!activeChapterId}>+ Szene</button>
          <div className="side-list">
            {(scenesByChapter[activeChapterId] || []).map(s => (
              <button
                key={s.id}
                type="button"
                className={`side-item-btn ${activeSceneId === s.id ? 'active' : ''}`}
                onClick={() => onSelectScene(s)}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="panel">
          <input
            className="scene-title"
            value={sceneTitle}
            onChange={(e) => setSceneTitle(e.target.value)}
            placeholder="Szenen-Titel"
          />
          <textarea
            className="scene-editor"
            value={sceneContent}
            onChange={(e) => setSceneContent(e.target.value)}
            placeholder="Dein Text…"
          />
        </div>
      </main>
    </div>
  )
}

```

### `frontend\src\pages\World.jsx`
```jsx
import React from 'react'

export default function World(){
  // Sp�ter: Welt-Elemente (Organisation, Orte, Beziehungen etc.)
  return (
    <div className="page-wrap">
      <aside className="side">
        <div className="side-group">
          <div className="side-head">Welt-Elemente</div>
          <button className="btn small">+ Element</button>
          <div className="side-list">
            {/* Weltliste */}
          </div>
        </div>
      </aside>
      <main className="main">
        <div className="panel">
          <h3>Welt-Details</h3>
          <p className="empty">W�hle links ein Element oder lege ein neues an.</p>
        </div>
      </main>
    </div>
  )
}

```

### `frontend\src\projectview.css`
```css
.side-group + .side-group{ margin-top: 1rem; }
.side-head{ font-weight:700; margin-bottom:.4rem; }

.side-list{
  display:flex; flex-direction:column; gap:.35rem; margin-top:.5rem;
}

/* Buttons statt Divs: zuverl�ssige Klick-Hitbox + Tastaturfokus */
.side-item-btn{
  width: 100%;
  text-align: left;
  background: #0c1219;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: .45rem .6rem;
  cursor: pointer;
  transition: .15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
}
.side-item-btn:hover{ border-color:#2a3848; }
.side-item-btn.active{
  background: #0f1823;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(78,161,255,.15) inset;
}

.scene-title{
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: .6rem;
}

.scene-editor{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  line-height: 1.55;
  min-height: 360px;
}

```

### `frontend\src\styles.css`
```css
:root { --bg:#0b0f14; --panel:#121821; --card:#151c27; --text:#e5eef7; --muted:#9fb1c6; --accent:#5aa2ff; --danger:#ff6b6b; }
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial}
.container{max-width:1200px;margin:0 auto;padding:24px}
.appbar{position:sticky;top:0;background:#0d131c;border-bottom:1px solid #1f2940;padding:12px 24px;z-index:10}
.brand{color:var(--text);text-decoration:none;font-weight:700}
h1{margin:12px 0 16px}
.row{display:flex;gap:8px;align-items:center;margin-bottom:16px}
input,textarea{background:#0e141d;border:1px solid #1f2940;color:var(--text);padding:8px 10px;border-radius:8px;width:100%}
button{background:var(--accent);border:none;color:white;padding:10px 14px;border-radius:10px;cursor:pointer}
button.btn{background:#20304a}
button.btn.danger{background:var(--danger)}
button.small{padding:6px 10px;font-size:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.card{background:var(--card);border:1px solid #1f2940;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:6px}
.card-title{font-weight:700}
.card-actions{display:flex;gap:8px;margin-top:8px}
.card-body{color:var(--muted)}
.tabs{display:flex;gap:8px;margin-bottom:12px}
.tabs button{background:#182235}
.tabs button.active{background:var(--accent)}
.empty{opacity:.7;padding:16px;background:#0f1520;border:1px dashed #24324f;border-radius:12px}
.preview{padding:8px;background:#0f1520;border:1px solid #1f2940;border-radius:12px}
.preview h2{margin:18px 0 6px}
.preview h3{margin:12px 0 4px}
.list{list-style:none;padding:0;margin:8px 0 0;display:flex;flex-direction:column;gap:6px}
.list li{padding:8px;border-radius:8px;background:#0f1520;border:1px solid #23314f;cursor:pointer}
.list li.active{background:#20304a}
.title-input{font-size:18px;font-weight:700;margin-bottom:8px}
.content-input{min-height:420px;line-height:1.55}
.appbar a.brand{letter-spacing:.3px}

```

### `frontend\vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  },
  build: { outDir: 'dist' }
})

```

### `make-snapshot.ps1`
```powershell
param(
  [string]$OutFile = "code-snapshot.md",
  [int]$MaxKB = 150
)

$root = Get-Location
$project = Split-Path -Leaf $root

function WriteLine($text="") {
  $text | Out-File -FilePath $OutFile -Append -Encoding utf8
}

function IsExcludedFile($path) {
  $name = [System.IO.Path]::GetFileName($path)
  $ext  = [System.IO.Path]::GetExtension($path).ToLowerInvariant()

  $excludeDirs  = @('node_modules','.git','dist','build','.venv','venv','__pycache__','.idea','.vscode','coverage','.cache','.next','.turbo')
  $excludeFiles = @('package-lock.json','yarn.lock','pnpm-lock.yaml','app.db','*.sqlite','*.sqlite3','.env*','*.png','*.jpg','*.jpeg','*.gif','*.webp','*.ico','*.pdf','*.ttf','*.otf','*.woff','*.woff2','*.zip')

  foreach($d in $excludeDirs)  { if ($path -like "*\$d\*") { return $true } }
  foreach($f in $excludeFiles) { if ($name -like $f)      { return $true } }

  $whitelistExt = @('.js','.jsx','.ts','.tsx','.json','.css','.scss','.md','.yml','.yaml','.html','.py','.txt','.sql','.ini','.toml','.cfg','.conf','.bat','.ps1')
  if ($whitelistExt -notcontains $ext) { return $true }

  return $false
}

$map = @{
  '.js'='javascript'; '.jsx'='jsx'; '.ts'='ts'; '.tsx'='tsx'; '.json'='json';
  '.css'='css'; '.scss'='scss'; '.md'='markdown'; '.yml'='yaml'; '.yaml'='yaml';
  '.html'='html'; '.py'='python'; '.txt'='text'; '.sql'='sql'; '.ini'='ini';
  '.bat'='bat'; '.ps1'='powershell'; '.toml'='toml'; '.cfg'='ini'; '.conf'='ini'
}

# Header
$header = "<!-- Generated " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + " -->`n# " + $project + " - Code Snapshot`n"
Set-Content -Path $OutFile -Value $header -Encoding utf8

WriteLine "## Projektstruktur"
WriteLine '```'
$tree = & cmd /c "tree /F /A"
WriteLine $tree
WriteLine '```'
WriteLine ""

WriteLine "## Dateien"
WriteLine ""

Get-ChildItem -Recurse -File | Sort-Object FullName | ForEach-Object {
  $full = $_.FullName
  if (IsExcludedFile $full) { return }

  $rel   = $full.Substring($root.Path.Length + 1)
  $ext   = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
  $lang  = $map[$ext]; if (-not $lang) { $lang = "" }
  $sizeKB = [int][math]::Ceiling($_.Length / 1KB)

  # Inline-Code: zwei Backticks schreiben einen echten Backtick
  WriteLine ("### ``" + $rel + "``")

  if ($sizeKB -gt $MaxKB) {
    WriteLine ("_Datei groesser als " + $MaxKB + " KB, ausgelassen._")
    WriteLine ""
  } else {
    WriteLine ('```' + $lang)
    Get-Content -Raw -Encoding utf8 $full | Out-File -FilePath $OutFile -Append -Encoding utf8
    WriteLine '```'
    WriteLine ""
  }
}

Write-Host ("Fertig: " + $OutFile)

```

### `README.md`
```markdown
# Writehaven – Clean Rebuild v2 (voll funktionsfähig)

## Lokal starten
### Backend
```bash
cd backend
python -m venv .venv
# PowerShell: .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# Variante 1 (Repo-Root):
python -m backend.app
# Variante 2 (Direkt im Ordner backend):
# python app.py
```
Test:
- http://127.0.0.1:5000/api/health → {"status":"ok"}
- POST http://127.0.0.1:5000/api/projects  Body: {"title":"Test"}

### Frontend
```bash
cd frontend
npm install
npm run dev
# http://127.0.0.1:5173
```

## Cloud
- Amplify (Frontend): VITE_API_BASE_URL = AppRunner-URL
- App Runner (Backend): ENV DATABASE_URL=postgresql+psycopg://USER:PASS@HOST:5432/DB

```

### `snapshot.md`
_Datei groesser als 200 KB, ausgelassen._

