import { ContextMenuProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugContext = () => {
  debugData<ContextMenuProps>([
    {
      action: 'showContext',
      data: {
        title: 'COMPLETE CONTEXT MENU TEST',
        options: [
          { title: 'Empty button' },
          {
            title: 'Karin Kuruma',
            image: 'https://cdn.discordapp.com/attachments/1063098499027173461/1064276343585505330/screenshot.jpg',
            arrow: true,
            colorScheme: 'blue',
            metadata: [
              {
                ['label']: 'Body',
                ['value']: '55%',
                ['progress']: 55,
                colorScheme: 'red',
              },
              {
                ['label']: 'Engine',
                ['value']: '100%',
                ['progress']: 100,
                colorScheme: 'green',
              },
              {
                ['label']: 'Oil',
                ['progress']: 11,
              },
              {
                ['label']: 'Fuel',
                ['progress']: 87,
              },
            ],
          },
          {
            title: 'Example button',
            description: 'Example button description',
            icon: 'inbox',
            image: 'https://i.imgur.com/YAe7k17.jpeg',
            metadata: [{ label: 'Value 1', value: 300 }],
            disabled: true,
          },
          {
            title: 'Oil Level',
            description: 'Vehicle oil level',
            progress: 30,
            icon: 'oil-can',
            metadata: [{ label: 'Remaining Oil', value: '30%' }],
            arrow: true,
          },
          {
            title: 'Durability',
            progress: 80,
            icon: 'car-side',
            metadata: [{ label: 'Durability', value: '80%' }],
            colorScheme: 'blue',
          },
          {
            title: 'Submenu Button (Test Functionality)',
            icon: 'bars',
            menu: 'other_example_menu',
            arrow: true,
            description: 'Takes you to another menu - this actually works now!',
            metadata: ['Submenu functionality is now properly implemented'],
            colorScheme: 'green',
          },
          {
            title: 'Event button',
            description: 'Open a menu and send event data',
            icon: 'check',
            arrow: true,
            event: 'some_event',
            args: { value1: 300, value2: 'Other value' },
          },
          {
            title: 'Long Title Button That Should Demonstrate Text Wrapping',
            description: 'This is a very long description that should demonstrate proper text wrapping functionality within the glassmorphism container without overflowing or getting cut off when hovering over this button',
            icon: 'text-width',
            colorScheme: 'orange',
            metadata: [
              'Text wrapping demonstration',
              'Glassmorphism design',
              'Enhanced UI functionality'
            ],
          },
        ],
      },
    },
    {
      action: 'showContext',
      data: {
        title: 'SUBMENU EXAMPLE',
        menu: 'Vehicle garage', // Back button goes to main menu
        options: [
          {
            title: 'Submenu Option 1',
            description: 'This is a working submenu option',
            icon: 'star',
            colorScheme: 'yellow',
          },
          {
            title: 'Submenu Option 2',
            description: 'Another submenu option with progress',
            icon: 'cog',
            progress: 75,
            colorScheme: 'blue',
            metadata: [
              { label: 'Progress', value: '75%', progress: 75, colorScheme: 'blue' }
            ],
          },
          {
            title: 'Long Submenu Title That Should Wrap Properly Within The Container',
            description: 'This is a very long description that should demonstrate proper text wrapping functionality within the glassmorphism container without overflowing or getting cut off when hovering',
            icon: 'text-width',
            colorScheme: 'purple',
            metadata: [
              'Text wrapping test',
              'Multiple metadata lines',
              'Glassmorphism UI design',
            ],
          },
          {
            title: 'Back to Main Menu',
            description: 'Go back to the main context menu',
            icon: 'arrow-left',
            menu: 'Vehicle garage',
            colorScheme: 'red',
          },
        ],
      },
    },
  ]);
};
