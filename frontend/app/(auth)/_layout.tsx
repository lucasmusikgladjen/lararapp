import { Tabs } from "expo-router";

export default function AuthLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: "Lektioner",
        }}
      />
      <Tabs.Screen
        name="find-students"
        options={{
          title: "Hitta elever",
        }}
      />
    </Tabs>
  );
}
