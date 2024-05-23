<p align="center">
  <img src="https://github.com/ramizairi/Riguelni/assets/121579805/57a4c809-c301-4d75-ac7c-c9aac5626a7b" height="170" alt="auto_route_logo">
</p>


<p align="center">
  <a href="https://buymeacoffee.com/ramizeyrie" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="30px" width= "108px">
  </a>
</p>
<p align="center">
  <img src="https://github.com/ramizairi/Riguelni/assets/121579805/c0861fb8-1275-41d3-863c-f4fa517517b0" alt="buymeacoffee" height="100px" width="100px">
</p>
<p align="center">
Open source app can help you to manage your daily tasks using AI
</p>

---

## Preview

|                                                          LOGIN INTERFACE                                                          |                                                        MANAGE TASKS EXEMPLE                                                        |                                                         CHAT WITH AI EXEMPLE                                                         |
| :------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: |
| <img src='https://github.com/ramizairi/Riguelni/assets/121579805/79b34b94-fb3b-4cc5-bee3-60499c7e4297' height='600' width='300' /> | <img src='https://github.com/ramizairi/Riguelni/assets/121579805/47df8894-b4ad-4db4-ba25-047f792b6fdc' height='600' width='300'/> | <img src='https://github.com/ramizairi/Riguelni/assets/121579805/8966e48d-c3cb-4ef8-81b2-0761436dd723' height='600' width='300'/> |

## Installation

Add package to your pubspec:

```yaml
dependencies:
  flutter_overlay_window: any # or the latest version on Pub
```

### Android

You'll need to add the `SYSTEM_ALERT_WINDOW` permission and `OverlayService` to your Android Manifest.

```XML
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

    <application>
        ...
        <service android:name="flutter.overlay.window.flutter_overlay_window.OverlayService" android:exported="false" />
    </application>
```

### Entry point

Inside `main.dart` create an entry point for your Overlay widget;

```dart

// overlay entry point
@pragma("vm:entry-point")
void overlayMain() {
  runApp(const MaterialApp(
    debugShowCheckedModeBanner: false,
    home: Material(child: Text("My overlay"))
  ));
}

```

### USAGE

```dart
 /// check if overlay permission is granted
 final bool status = await FlutterOverlayWindow.isPermissionGranted();

 /// request overlay permission
 /// it will open the overlay settings page and return `true` once the permission granted.
 final bool status = await FlutterOverlayWindow.requestPermission();

  /// Open overLay content
  ///
  /// - Optional arguments:
  ///
  /// `height` the overlay height and default is [WindowSize.fullCover]
  ///
  /// `width` the overlay width and default is [WindowSize.matchParent]
  ///
  /// `alignment` the alignment postion on screen and default is [OverlayAlignment.center]
  ///
  /// `visibilitySecret` the detail displayed in notifications on the lock screen and default is [NotificationVisibility.visibilitySecret]
  ///
  /// `OverlayFlag` the overlay flag and default is [OverlayFlag.defaultFlag]
  ///
  /// `overlayTitle` the notification message and default is "overlay activated"
  ///
  /// `overlayContent` the notification message
  ///
  /// `enableDrag` to enable/disable dragging the overlay over the screen and default is "false"
  ///
  /// `positionGravity` the overlay postion after drag and default is [PositionGravity.none]
  ///
  /// `startPosition` the overlay start position and default is null
 await FlutterOverlayWindow.showOverlay();

 /// closes overlay if open
 await FlutterOverlayWindow.closeOverlay();

 /// broadcast data to and from overlay app
 await FlutterOverlayWindow.shareData("Hello from the other side");

 /// streams message shared between overlay and main app
  FlutterOverlayWindow.overlayListener.listen((event) {
      log("Current Event: $event");
    });

 /// use [OverlayFlag.focusPointer] when you want to use fields that show keyboards
 await FlutterOverlayWindow.showOverlay(flag: OverlayFlag.focusPointer);


 /// update the overlay flag while the overlay in action
 await FlutterOverlayWindow.updateFlag(OverlayFlag.defaultFlag);

 /// Update the overlay size in the screen
 await FlutterOverlayWindow.resizeOverlay(80, 120);

 /// Update the overlay position in the screen
 ///
 /// `position` the new position of the overlay
 ///
 /// `return` true if the position updated successfully
 await FlutterOverlayWindow.moveOverlay(OverlayPosition(0, 156))

 /// Get the current overlay position
 ///
 /// `return` the current overlay position
 await FlutterOverlayWindow.getOverlayPosition()

```

```dart

enum OverlayFlag {
  /// Window flag: this window can never receive touch events.
  /// Usefull if you want to display click-through overlay
  clickThrough,

  /// Window flag: this window won't ever get key input focus
  /// so the user can not send key or other button events to it.
  defaultFlag,

  /// Window flag: allow any pointer events outside of the window to be sent to the windows behind it.
  /// Usefull when you want to use fields that show keyboards.
  focusPointer,
}

```

```dart

  /// Type of dragging behavior for the overlay.
  enum PositionGravity {
    /// The `PositionGravity.none` will allow the overlay to postioned anywhere on the screen.
    none,

    /// The `PositionGravity.right` will allow the overlay to stick on the right side of the screen.
    right,

    /// The `PositionGravity.left` will allow the overlay to stick on the left side of the screen.
    left,

    /// The `PositionGravity.auto` will allow the overlay to stick either on the left or right side of the screen depending on the overlay position.
    auto,
  }


```
